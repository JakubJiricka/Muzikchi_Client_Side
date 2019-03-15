import {Component, Input, ViewEncapsulation} from '@angular/core';
import {AppearanceEditor} from "../../appearance-editor/appearance-editor.service";
import {AppearanceEditableField} from '../../../../core/config/vebto-config';

@Component({
    selector: 'appearance-text-input',
    templateUrl: './appearance-text-input.component.html',
    styleUrls: ['./appearance-text-input.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AppearanceTextInputComponent {

    /**
     * Editable field this input is attached to.
     */
    @Input() field: AppearanceEditableField;

    /**
     * AppearanceTextInputComponent Constructor.
     */
    constructor(
        private editor: AppearanceEditor,
    ) {}

    /**
     * Fired when editable field is focused.
     */
    public onFocus(field: AppearanceEditableField) {
        this.editor.highlightElement(field.selector);
    }

    /**
     * Fired when editable field loses focus.
     */
    public onBlur() {
        this.editor.removeHighlight();
    }

    /**
     * Commit text input changes.
     */
    public commitChanges(field: AppearanceEditableField) {
        this.editor.applySetting(field.key, field.value);
        this.editor.changes.add(field.key, field.value);
    }
}