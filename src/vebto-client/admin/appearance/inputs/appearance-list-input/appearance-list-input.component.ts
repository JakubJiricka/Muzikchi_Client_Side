import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {AppearanceEditor} from "../../appearance-editor/appearance-editor.service";
import {Settings} from "../../../../core/config/settings.service";
import {AppearanceEditableField} from '../../../../core/config/vebto-config';
import {Translations} from '../../../../core/translations/translations.service';

@Component({
    selector: 'appearance-list-input',
    templateUrl: './appearance-list-input.component.html',
    styleUrls: ['./appearance-list-input.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AppearanceListInputComponent implements OnInit {

    /**
     * Editable field this input is attached to.
     */
    @Input() field: AppearanceEditableField;

    constructor(
        public editor: AppearanceEditor,
        private i18n: Translations,
        private settings: Settings,
    ) {}

    ngOnInit() {
        //decode field value json if needed
        if (this.field.value && ! Array.isArray(this.field.value)) {
            this.field.value = JSON.parse(this.field.value);
        }
    }

    /**
     * Add a new list item.
     */
    public addNewItem() {
        this.field.value.push({title: this.i18n.t('New Item'), content: this.i18n.t('Item content')});
        this.commitChanges();
    }

    /**
     * Remove specified list item.
     */
    public removeItem(item: object) {
        const i = this.field.value.indexOf(item);
        this.field.value.splice(i, 1);
        this.commitChanges();
    }

    /**
     * Highlight item that is being edited in preview.
     */
    public onFocus(selector: string, index) {
        this.editor.highlightElement(this.field.selector + ' ' + selector, index);
    }

    /**
     * Commit list item changes.
     */
    public commitChanges() {
        let value = JSON.stringify(this.field.value);
        this.settings.set(this.field.key, value);
        this.editor.changes.add(this.field.key, value);
    }
}