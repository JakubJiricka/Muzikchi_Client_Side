import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {AppearanceEditor} from "../../appearance-editor/appearance-editor.service";
import {CodeEditorModalComponent} from "../../code-editor-modal/code-editor-modal.component";
import {Modal} from "../../../../core/ui/modal.service";
import {AppearanceEditableField} from '../../../../core/config/vebto-config';
import {Settings} from '../../../../core/config/settings.service';
import {randomString} from '../../../../core/utils/random-string';
import {Toast} from '../../../../core/ui/toast.service';

type CustomCodeEl = HTMLLinkElement|HTMLScriptElement;

@Component({
    selector: 'appearance-code-input',
    templateUrl: './appearance-code-input.component.html',
    styleUrls: ['./appearance-code-input.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AppearanceCodeInputComponent implements OnInit {

    /**
     * Editable field this input is attached to.
     */
    @Input() field: AppearanceEditableField;

    /**
     * AppearanceCodeInputComponent Constructor.
     */
    constructor(
        private editor: AppearanceEditor,
        private modal: Modal,
        private settings: Settings,
        private toast: Toast,
    ) {}

    ngOnInit() {
        this.addCodeToPreview(
            this.field.config.language,
        );
    }

    /**
     * Open code editor modal and commit resulting changes.
     */
    public openModal(field: AppearanceEditableField) {
        const params = {contents: this.getValue(), language: field.config.language},
            className = 'code-editor-modal-container';

        this.modal.open(CodeEditorModalComponent, params, className)
            .afterClosed().subscribe(value => {
                if (this.getValue() === value) return;

                this.saveChanges(field, value).subscribe(() => {
                    this.addCodeToPreview(field.config.language);
                    this.toast.open('Custom code saved');
                });
            });
    }

    /**
     * Add custom css/js to preview iframe
     */
    private addCodeToPreview(type: 'css'|'js') {
        this.getOrCreateEl(type)
    }

    /**
     * Create styles element for custom css
     * or return existing one if already created.
     */
    private getOrCreateEl(type: 'css'|'js' = 'css'): CustomCodeEl {
        let el = this.editor
            .getDocument()
            .querySelector('#editor-custom-'+type) as CustomCodeEl;

        if ( ! el) {
            el = type === 'css' ? this.createLink() : this.createScript();
            el.id = 'editor-custom-'+type;
            this.editor.getDocument().head.appendChild(el);
        } else {
            this.updateElHash(type, el);
        }

        return el;
    }

    private updateElHash(type: 'css'|'js', el: CustomCodeEl) {
        const newHash = '?hash='+randomString(5);

        if (type === 'css') {
            const link = el as HTMLLinkElement;
            link.href = link.href.split('?')[0]+newHash
        } else {
            const script = el as HTMLScriptElement;
            script.src = script.src.split('?')[0]+newHash
        }
    }

    private createScript(): HTMLScriptElement {
        const script = this.editor.getDocument().createElement('script');
        script.src = this.getCustomCodePath('js');
        return script;
    }

    private createLink(): HTMLLinkElement {
        const link = this.editor.getDocument().createElement('link');
        link.href = this.getCustomCodePath('css'); link.rel = 'stylesheet';
        return link;
    }

    private getCustomCodePath(type: 'css'|'js') {
        let base = this.settings.getBaseUrl(true);
        base += 'storage/custom-code/custom-';
        base += (type === 'css' ? 'styles.css' : 'scripts.js');
        return base+'?hash='+randomString(5);
    }

    private getValue() {
        // TODO: see why field.defaultValue needs to be used.
        return this.field.value || this.field.defaultValue;
    }

    /**
     * Commit code field changes.
     */
    private saveChanges(field: AppearanceEditableField, newValue: string) {
        field.value = newValue;
        const changes = {};
        changes[field.key] = newValue;
        return this.editor.changes.saveChanges(changes);
    }
}