import {Component, OnInit, ViewEncapsulation} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {Pages} from "../pages.service";
import {Page} from "../../types/models/Page";
import {Settings} from '../../config/settings.service';

@Component({
    selector: 'custom-page',
    templateUrl: './custom-page.component.html',
    styleUrls: ['./custom-page.component.scss'],
    providers: [Pages],
    encapsulation: ViewEncapsulation.None,
})
export class CustomPageComponent implements OnInit {

    /**
     * Page model instance.
     */
    public page: Page = new Page;

    /**
     * Page body trusted by angular.
     */
    public body: SafeHtml;

    /**
     * PagesComponent Constructor.
     */
    constructor(
        private pages: Pages,
        private route: ActivatedRoute,
        private sanitizer: DomSanitizer,
        private router: Router,
        public settings: Settings,
    ) {}

    ngOnInit() {
        this.route.params.subscribe(params => {
            const id = params.id || this.route.snapshot.data.id;

            this.pages.get(id).subscribe(page => {
                this.page = page;
                this.body = this.sanitizer.bypassSecurityTrustHtml(page.body);
            }, () => {
                this.router.navigate(['/404'], {skipLocationChange: true});
            });
        })
    }
}
