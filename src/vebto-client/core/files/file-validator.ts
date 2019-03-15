import {Injectable} from '@angular/core';
import {MatSnackBar} from "@angular/material";
import {FilesModule} from './files.module';

@Injectable({
    providedIn: FilesModule,
})
export class FileValidator {

    /**
     * Rules that files under validation must pass.
     */
    public rules = {
        maxSize: 50000 * 1000, //kilobytes
        maxFiles: 5,
        blacklist: [],
        whitelist: [],
    };

    /**
     * FileValidator Constructor.
     */
    constructor(private toast: MatSnackBar) {}

    /**
     * Validate specified files and optionally show error messages in toast window..
     */
    public validateFiles(fs: File[] | FileList, showErrors = false) {
        let errors = {};

        if (fs.length > this.rules.maxFiles) {
            errors['*'] = 'you can upload a maximum of '+this.rules.maxFiles+' files.';
        }

        for (let i = 0; i < fs.length; i++) {
            let fileErrors = this.validateFile(fs[i]);
            if (fileErrors) errors[fs[i].name] = fileErrors;
        }

        let hasErrors = Object.keys(errors).length;

        if (showErrors && hasErrors) {
            this.toast.open(errors[Object.keys(errors)[0]]);
        }

        return hasErrors ? errors : null;
    }

    /**
     * Validate specified file against validation rules and return errors.
     */
    public validateFile(file: File): string[]|null {
        let errors = [];
        let extension = FileValidator.getFileNameAndExtension(file.name).extension;

        if (file.size > this.rules.maxSize) {
            errors.push(file.name+' is to large. Maximum file size is '+this.rules.maxSize);
        }

        if (this.rules.blacklist.indexOf(extension) > -1) {
            errors.push(file.name+' type is invalid. '+extension+' files are not allowed.');
        }

        if (this.rules.whitelist.length && this.rules.whitelist.indexOf(extension) === -1) {
            errors.push(file.name+' type is invalid. Only '+this.rules.whitelist.join(', ')+' extensions are allowed.');
        }

        return errors.length ? errors : null;
    }

    static getFileNameAndExtension(fullFileName: string) {
        var re = /(?:\.([^.]+))?$/
        var fileExt = re.exec(fullFileName)[1]
        var fileName = fullFileName.replace('.' + fileExt, '')
        return {
            name: fileName,
            extension: fileExt
        }
    }

    static getFileType (file: File) {
        const extensionsToMime = {
            'md': 'text/markdown',
            'markdown': 'text/markdown',
            'mp4': 'video/mp4',
            'mp3': 'audio/mp3',
            'svg': 'image/svg+xml',
            'jpg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'yaml': 'text/yaml',
            'yml': 'text/yaml'
        }

        const fileExtension = file.name ? FileValidator.getFileNameAndExtension(file.name).extension : null

        //check if mime type is set in the file object
        if (file.type) {
            return file.type
        }

        //see if we can map extension to a mime type
        if (fileExtension && extensionsToMime[fileExtension]) {
            return extensionsToMime[fileExtension]
        }

        return null
    }
}