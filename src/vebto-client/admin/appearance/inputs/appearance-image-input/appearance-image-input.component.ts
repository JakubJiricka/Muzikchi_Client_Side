import {Component, Input, ViewEncapsulation} from '@angular/core';
import {AppearanceEditor} from "../../appearance-editor/appearance-editor.service";
import {Modal} from "../../../../core/ui/modal.service";
import {UploadFileModalComponent} from "../../../../core/files/upload-file-modal/upload-file-modal.component";
import {AppearanceEditableField} from '../../../../core/config/vebto-config';

@Component({
    selector: 'appearance-image-input',
    templateUrl: './appearance-image-input.component.html',
    styleUrls: ['./appearance-image-input.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AppearanceImageInputComponent {

    /**
     * Editable field this input is attached to.
     */
    @Input() field: AppearanceEditableField;

    /**
     * AppearanceImageInputComponent Constructor.
     */
    constructor(
        private editor: AppearanceEditor,
        private modal: Modal,
    ) {}

    /**
     * Open modal for changing specified editable field image.
     */
    public openModal(field: AppearanceEditableField) {
        const params = {uri: 'uploads/images', httpParams: {type: 'branding'}};

        this.modal.show(UploadFileModalComponent, params).afterClosed().subscribe(uploadedFile => {
            if ( ! uploadedFile) return;

            this.updateValue(uploadedFile.url);

            //re-position highlight element box after uploading image,
            //use timeout to wait until new image is loaded properly
            setTimeout(() => {
                this.editor.highlightElement(field.selector);
            }, 100);
        });
    }

    /**
     * Remove current editable field image.
     */
    public remove() {
        this.updateValue(null);
    }

    /**
     * Use default value for image field.
     */
    public useDefault() {
        this.updateValue(this.field.defaultValue);
    }

    /**
     * Update current image field value.
     */
    private updateValue(value: string) {
        this.commitChanges(this.field, value);
        this.editor.applySetting(this.field.key, value);
    }

    /**
     * Commit image changes.
     */
    private commitChanges(field: AppearanceEditableField, newValue: any) {
        field.value = newValue;
        this.editor.changes.add(field.key, newValue);
    }
}