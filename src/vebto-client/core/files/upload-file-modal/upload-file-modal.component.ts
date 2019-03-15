import {Component, Inject, Optional, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {Uploads} from "../uploads.service";
import {Settings} from "../../config/settings.service";
import {FileValidator} from '../file-validator';

export interface uploadParams {
    uri: string,
    httpParams: object
}

export interface UploadedFile {
    type?: string,
    name: string,
    extension: string,
    url?: string,
    data?: string,
}

@Component({
    selector: 'upload-file-modal',
    templateUrl: './upload-file-modal.component.html',
    styleUrls: ['./upload-file-modal.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class UploadFileModalComponent {

    /**
     * Name of current active tab.
     */
    public activeTab: string = 'upload';

    /**
     * Model for image url.
     */
    public uploadedFile: UploadedFile;

    /**
     * File upload errors (if there are any).
     */
    public errors: object;

    /**
     * Current upload progress or null if no uploads are in progress.
     */
    public uploadProgress: number | null = null;

    /**
     * InsertImageModal Constructor.
     */
    constructor(
        private uploads: Uploads,
        private settings: Settings,
        private dialogRef: MatDialogRef<UploadFileModalComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: uploadParams,
    ) {}

    /**
     * Close modal and reset its state.
     */
    public close() {
        this.uploadedFile = null;
        this.dialogRef.close(this.uploadedFile);
    }

    /**
     * Fired when user is done with this modal.
     */
    public confirm() {
        if (this.errors || ! this.uploadedFile) return;
        this.dialogRef.close(this.uploadedFile);
    }

    /**
     * Set active tab to specified one.
     */
    public setActiveTab(name: string) {
        this.activeTab = name;
    }

    /**
     * Set specified link as link model.
     */
    public setLinkModel(link: string) {
        this.errors = null;

        const img = FileValidator.getFileNameAndExtension(link.split('/').pop());

        this.uploadedFile = {
            name: img.name,
            extension: img.extension,
            url: link,
        };
    }

    /**
     * Open browser dialog for selecting files, upload files
     * and set linkModel to absolute url of uploaded image.
     */
    public uploadFiles(files: FileList) {
        this.errors = this.uploads.filesAreInvalid(files);
        if (this.errors) return;

        this.uploadedFile = {
            name: files[0].name,
            type: FileValidator.getFileType(files[0]),
            extension: FileValidator.getFileNameAndExtension(files[0].name).extension,
        };

        //if no uri is specified, just return uploaded file data
        if ( ! this.data) {
            const reader = new FileReader();

            reader.addEventListener('load', () => {
                this.uploadedFile.data = reader.result;
                this.confirm();
            });

            if (this.uploadedFile.extension === 'json') {
                reader.readAsText(files[0]);
            } else {
                reader.readAsDataURL(files[0]);
            }
        } else {
            this.uploads.uploadFiles(files, this.data).subscribe(event => {
                switch (event.name) {
                    case 'upload_started':
                        this.uploadProgress = 0;
                        break;
                    case 'upload_progress':
                        this.uploadProgress = event.progress;
                        break;
                    case 'upload_completed':
                        this.uploadProgress = null;
                        this.uploadedFile.url = event.body.data[0].url;
                        this.confirm();
                }
            }, response => {
                this.errors = response.messages;
                this.uploadProgress = null;
            });
        }
    }

    /**
     * Check if image at specified url exists and is valid.
     */
    private validateImage(url: string): Promise<any> {
        return new Promise((resolve, reject) => {
            let timeout = 500;
            let timer, img = new Image();

            //image is invalid
            img.onerror = img.onabort = () => {
                clearTimeout(timer);
                reject();
            };

            //image is valid
            img.onload = function () {
                clearTimeout(timer);
                resolve();
            };

            //reject image if loading it times out
            timer = setTimeout(function () {
                img = null; reject();
            }, timeout);

            img.src = url;
        });
    }
}