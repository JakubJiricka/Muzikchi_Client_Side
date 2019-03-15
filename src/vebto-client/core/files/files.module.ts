import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UploadFileModalComponent} from './upload-file-modal/upload-file-modal.component';
import {FileDropzoneDirective} from './file-dropzone/file-dropzone.directive';
import {SvgIconModule} from '../ui/svg-icon/svg-icon.module';
import {MapToIterableModule} from '../ui/map-to-iterable/map-to-iterable.module';
import {MatButtonModule, MatDialogModule, MatProgressBarModule} from '@angular/material';

@NgModule({
    imports: [
        SvgIconModule,
        CommonModule,
        MapToIterableModule,

        //material
        MatDialogModule,
        MatButtonModule,
        MatProgressBarModule,
    ],
    declarations: [
        UploadFileModalComponent,
        FileDropzoneDirective,
    ],
    exports: [
        UploadFileModalComponent,
        FileDropzoneDirective,
    ],
    entryComponents: [
        UploadFileModalComponent
    ],
})
export class FilesModule {
}
