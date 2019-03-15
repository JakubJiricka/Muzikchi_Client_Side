import {Injectable} from '@angular/core';
import {MatSnackBar} from "@angular/material";
import {Settings} from "../config/settings.service";
import {Translations} from "../translations/translations.service";
import {MatSnackBarRef} from '@angular/material/snack-bar/typings/snack-bar-ref';
import {SimpleSnackBar} from '@angular/material/snack-bar/typings/simple-snack-bar';

@Injectable({
    providedIn: 'root'
})
export class Toast {

    /**
     * Toast Constructor.
     */
    constructor(private settings: Settings, private i18n: Translations, private snackbar: MatSnackBar) {}

    public open(message: string, config: {duration?: number, action?: string} = {}): MatSnackBarRef<SimpleSnackBar> {
        if ( ! config.duration && config.duration !== 0) {
            config.duration = this.settings.get('toast.default_timeout', 3000);
        }

        return this.snackbar.open(this.i18n.t(message), config.action, {duration: config.duration});
    }
}