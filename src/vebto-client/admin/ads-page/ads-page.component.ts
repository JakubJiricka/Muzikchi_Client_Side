import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Settings} from "../../core/config/settings.service";
import {Toast} from "../../core/ui/toast.service";
import {finalize} from "rxjs/operators";

@Component({
    selector: 'ads-page',
    templateUrl: './ads-page.component.html',
    styleUrls: ['./ads-page.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AdsPageComponent implements OnInit {

    /**
     * Ads model.
     */
    public ads = {};

    public loading: boolean = false;

    /**
     * AdsPageComponent Constructor.
     */
    constructor(
        public settings: Settings,
        private toast: Toast,
    ) {}

    ngOnInit() {
        this.hydrate();
    }

    /**
     * Save ads to the server.
     */
    public saveAds() {
        this.loading = true;

        this.settings.save({client: this.ads})
            .pipe(finalize(() => this.loading = false))
            .subscribe(() => {
                this.toast.open('Ads have been updated.');
            });
    }

    /**
     * Hydrate ads model.
     */
    private hydrate() {
        const all = this.settings.getAll();

        for (let name in all) {
            if (name.indexOf('ad_slot') > -1 || name === 'ads.disable') {
                this.ads[name] = all[name];
            }
        }
    }
}
