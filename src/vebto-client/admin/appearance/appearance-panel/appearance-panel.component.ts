import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {AppearanceEditor} from "../appearance-editor/appearance-editor.service";

@Component({
    selector: 'appearance-panel',
    templateUrl: './appearance-panel.component.html',
    styleUrls: ['./appearance-panel.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AppearancePanelComponent implements OnInit {

    /**
     * config for appearance panel.
     */
    @Input() public config;

    /**
     * AppearancePanelComponent Constructor.
     */
    constructor(public appearance: AppearanceEditor) {}

    ngOnInit() {
        if ( ! this.config.route) return;
        this.appearance.navigate(this.config.route);
    }
}
