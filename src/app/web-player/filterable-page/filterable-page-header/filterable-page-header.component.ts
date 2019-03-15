import {ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Subscription} from "rxjs";
import {BrowserEvents} from "vebto-client/core/services/browser-events.service";
import {Settings} from "vebto-client/core/config/settings.service";
import {Search} from "../../search/search.service";
import {WebPlayerState} from "../../web-player-state.service";

@Component({
    selector: 'filterable-page-header',
    templateUrl: './filterable-page-header.component.html',
    styleUrls: ['./filterable-page-header.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterablePageHeaderComponent implements OnInit, OnDestroy {
    @ViewChild('filterInput') filterInput: ElementRef;

    /**
     * Active component subscriptions.
     */
    private subscriptions: Subscription[] = [];
    public langFarsi = '' ;
    public lang ='farsi';

    /**
     * Form control for filter input;
     */
    @Input() public filterQuery: FormControl;

    /**
     * FilterablePageHeaderComponent Constructor.
     */
    constructor(
        public search: Search,
        private browserEvents: BrowserEvents,
        public settings: Settings,
        public state: WebPlayerState
    ) {}

    ngOnInit() {
        this.initKeybinds();
        this.langFarsi = this.settings.getAssetUrl('images/search/mobile_farsi_off.png');
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });

        this.subscriptions = [];
    }

    /**
     * Initiate volume keyboard shortcuts.
     */
    private initKeybinds() {
        const sub = this.browserEvents.globalKeyDown$.subscribe((e: KeyboardEvent) => {
            //ctrl+f - focus search bar
            if (e.ctrlKey && e.keyCode === this.browserEvents.keyCodes.letters.f) {
                this.filterInput.nativeElement.focus();
                e.preventDefault();
            }
        });

        this.subscriptions.push(sub);
    }

    /**
     * img display
     */
    public langChange() {
        if (this.lang === 'english') {
            this.langFarsi = this.settings.getAssetUrl('images/search/mobile_farsi_off.png');
            this.lang = 'farsi';
        } else if (this.lang === 'farsi') {
            this.langFarsi = this.settings.getAssetUrl('images/search/mobile_farsi_on.png');
            this.lang = 'english';
        }
        this.search.clearCache().subscribe(response=>{});
        this.search.chnageLanguage(this.lang).subscribe(response=>{});
    }
}
