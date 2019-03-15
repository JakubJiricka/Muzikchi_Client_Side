import {NgModule} from '@angular/core';
import {ConfirmModalComponent} from './confirm-modal.component';
import {MatButtonModule, MatDialogModule} from '@angular/material';
import {Modal} from '../modal.service';
import {SvgIconModule} from '../svg-icon/svg-icon.module';
import {CommonModule} from '@angular/common';

@NgModule({
    imports: [
        MatDialogModule,
        MatButtonModule,
        SvgIconModule,
        CommonModule,
    ],
    declarations: [
        ConfirmModalComponent
    ],
    entryComponents: [
        ConfirmModalComponent
    ],
    exports: [
        ConfirmModalComponent,
    ],
    providers: [
        Modal,
    ]
})
export class ConfirmModalModule {
}
