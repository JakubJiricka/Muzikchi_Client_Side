import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {Settings} from "../../config/settings.service";

@Component({
    selector: 'material-navbar',
    templateUrl: './material-navbar.component.html',
    styleUrls: ['./material-navbar.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class MaterialNavbar {

    @Input() menuPosition: string;

    @Input() showToggleButton: boolean = false;

    @Output() toggleButtonClick = new EventEmitter();

    /**
     * MaterialNavbar Constructor.
     */
    constructor(public config: Settings) {}
}
