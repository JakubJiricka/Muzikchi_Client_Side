import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {OverlayPanelRef} from '../overlay-panel/overlay-panel-ref';

@Component({
    selector: 'colorpicker-panel',
    templateUrl: './colorpicker-panel.component.html',
    styleUrls: ['./colorpicker-panel.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ColorpickerPanelComponent implements OnInit {
    @ViewChild('trigger') trigger: ElementRef;

    public color: string;

    constructor(private overlayPanelRef: OverlayPanelRef) {}

    ngOnInit() {
        setTimeout(() => {
            //open color picker
            this.trigger.nativeElement.click();
        });
    }

    public emitSelectedEvent(value: string) {
        this.color = value;
        this.overlayPanelRef.emitValue(value);
    }
}
