import {ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, Renderer2, ViewEncapsulation} from '@angular/core';
import {Settings} from "../../config/settings.service";
import {randomString} from "../../utils/random-string";
import {CurrentUser} from "../../../auth/current-user";
import {LazyLoaderService} from "../../utils/lazy-loader.service";

@Component({
    selector: 'ad-host',
    templateUrl: './ad-host.component.html',
    styleUrls: ['./ad-host.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {'[id]': 'randomId'}
})
export class AdHostComponent implements OnInit {

    /**
     * Random id to apply to add host.
     */
    public randomId: string;

    /**
     * Code of the ad.
     */
    private adCode: string;

    /**
     * Slot of this ad.
     */
    @Input() public slot: string;

    /**
     * AdHostComponent Constructor.
     */
    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        private settings: Settings,
        private currentUser: CurrentUser,
        private lazyLoader: LazyLoaderService,
    ) {}

    ngOnInit() {
        if (this.settings.get('ads.disable') || this.currentUser.isSubscribed()) return;

        this.randomId = randomString();
        this.setAdCode();
        if ( ! this.adCode) return;
        this.appendAdHtml();
        this.loadAdScripts().then(() => {
            this.executeAdJavascript();
        });

        setTimeout(() => {
            if ( ! this.el.nativeElement.children.length) return;
            this.renderer.setStyle(this.el.nativeElement, 'display', 'flex')
        });
    }

    /**
     * set ad that should be displayed.
     */
    private setAdCode() {
        this.adCode = this.settings.get(this.slot);
    }

    /**
     * Extract and append any non-javascript html tags from ad code.
     */
    private appendAdHtml() {
        //strip out all script tags from ad code and leave only html
        const adHtml = this.adCode.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').trim();

        if (adHtml) {
            this.el.nativeElement.innerHTML = adHtml;
        }
    } 

    /**
     * Execute ad code javascript and replace document.write if needed.
     */
    private executeAdJavascript() {
        //find any ad code javascript that needs to be executed
        let pattern = /<script\b[^>]*>([\s\S]*?)<\/script>/g, content;

        while (content = pattern.exec(this.adCode)) {
            if (content[1]) {
                const r = "var d = document.createElement('div'); d.innerHTML = $1; document.getElementById('"+this.randomId+"').appendChild(d.firstChild);";
                let toEval = content[1].replace(/document.write\((.+?)\);/, r);
                eval(toEval);
            }
        }
    }

    /**
     * Load any external scripts needed by ad.
     */
    private loadAdScripts(): Promise<any> {
        let promises = [];

        //load ad code script
        let pattern = /<script.*?src="(.*?)"/g, match;

        while (match = pattern.exec(this.adCode)) {
            if (match[1]) {
                promises.push(this.lazyLoader.loadScript(match[1]));
            }
        }

        return Promise.all(promises);
    }
}
