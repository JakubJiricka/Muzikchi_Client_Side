import {Component, ElementRef, Inject, ViewChild, ViewEncapsulation, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {LazyLoaderService} from "../../../core/utils/lazy-loader.service";
import {filter} from 'rxjs/operators';
import {ESCAPE} from '@angular/cdk/keycodes';

declare let ace;

export interface CodeEditorModalData {
    contents?: string,
    language: string
}

@Component({
    selector: 'code-editor-modal',
    templateUrl: './code-editor-modal.component.html',
    styleUrls: ['./code-editor-modal.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class CodeEditorModalComponent implements OnInit {
    @ViewChild('editor') editorEl: ElementRef;

    /**
     * Whether ace js library is being loaded currently.
     */
    public loading = false;

    /**
     * Ace editor instance.
     */
    private editor;

    /**
     * CodeEditorModalComponent Constructor.
     */
    constructor(
        private dialogRef: MatDialogRef<CodeEditorModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: CodeEditorModalData,
        private lazyLoader: LazyLoaderService,
    ) {}

    ngOnInit() {
        this.initEditor(this.data.contents, this.data.language);
        this.overrideDialogCloseEvents();
    }

    /**
     * Close modal and editor code editor contents.
     */
    public confirm() {
        this.close();
    }

    /**
     * Close the modal and pass specified data.
     */
    public close() {
        this.dialogRef.close(this.editor.getValue());
    }

    /**
     * Initiate code editor with specified contents.
     */
    private initEditor(contents: string, language = 'javascript') {
        this.loading = true;

        this.lazyLoader.loadScript('js/ace/ace.js').then(() => {
            this.editor = ace.edit(this.editorEl.nativeElement);
            this.editor.getSession().setMode('ace/mode/'+language);
            this.editor.setTheme('ace/theme/chrome');
            this.editor.$blockScrolling = Infinity;
            if (contents) this.editor.setValue(contents, 1);
            this.loading = false;
        });
    }

    /**
     * Need to always send dialog data, regardless of how it was closed.
     * Angular material does not provide easy way to do this, so
     * we need to override backdrop click and escape key close events.
     */
    private overrideDialogCloseEvents() {
        this.dialogRef.disableClose = true;

        //close on backdrop click
        this.dialogRef.backdropClick().subscribe(() => {
            this.close();
        });

        //close on escape key
        this.dialogRef.keydownEvents()
            .pipe(filter(event => event.keyCode === ESCAPE))
            .subscribe(() => this.close());
    }
}
