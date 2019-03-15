import {Component, ViewChild, ViewEncapsulation, OnInit, ElementRef} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AppearanceEditor} from "./appearance-editor/appearance-editor.service";

@Component({
    selector: 'appearance',
    templateUrl: './appearance.component.html',
    styleUrls: ['./appearance.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AppearanceComponent implements OnInit {
    @ViewChild('previewContainer') previewContainer: ElementRef;
    @ViewChild('selectedElBox') selectedElBox: ElementRef;

    /**
     * AppearanceComponent Constructor.
     */
    constructor(
        public appearanceEditor: AppearanceEditor,
        private router: Router,
        private route: ActivatedRoute,
    ) {}

    ngOnInit() {
        this.appearanceEditor.init(this.previewContainer, this.selectedElBox, this.route.snapshot.data.defaultSettings);
    }

    /**
     * Make specified panel active.
     */
    public openPanel(name: string) {
        this.appearanceEditor.activePanel = name;
    }

    /**
     * Close appearance editor.
     */
    public closeEditor() {
        this.router.navigate(['admin']);
    }
}
