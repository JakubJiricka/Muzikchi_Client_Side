import {NgModule} from '@angular/core';
import {ColorpickerPanelComponent} from './colorpicker-panel.component';
import {ColorPickerModule as NgxColorPickerModule} from 'ngx-color-picker';
import {Overlay, OverlayModule} from '@angular/cdk/overlay';
import {OverlayPanel} from '../overlay-panel/overlay-panel.service';

@NgModule({
    imports: [
        NgxColorPickerModule,
        OverlayModule,
    ],
    declarations: [
        ColorpickerPanelComponent,
    ],
    entryComponents: [
        ColorpickerPanelComponent,
    ],
    exports: [
        ColorpickerPanelComponent,
    ],
    providers: [
        Overlay,
        OverlayPanel,
    ]
})
export class ColorPickerModule {
}
