import {EventEmitter, Injectable} from "@angular/core";
import {Localization} from "../types/models/Localization";
import {Settings} from "../config/settings.service";
import {LocalizationWithLines} from '../types/localization-with-lines';

@Injectable({
    providedIn: 'root',
})
export class Translations {

    /**
     * Fired when active localization changes.
     */
    public localizationChange = new EventEmitter;

    /**
     * Currently active localization.
     */
    private localization: LocalizationWithLines = {model: new Localization(), lines: {}};

    /**
     * Translations Service Constructor.
     */
    constructor(private settings: Settings) {}

    /**
     * Translate specified key.
     */
    public t(transKey: string, values = {}): string {
        if ( ! this.translationsEnabled()) return transKey;

        let translation = this.localization.lines[transKey.toLowerCase().trim()] || transKey;

        //replace placeholders with specified values
        for (let key in values) {
            translation = translation.replace(':'+key, values[key]);
        }

        return translation;
    }

    /**
     * Get currently active localization.
     */
    public getActive(): LocalizationWithLines {
        return this.localization;
    }

    /**
     * Set active localization.
     */
    public setLocalization(localization: LocalizationWithLines) {
        if ( ! localization || ! localization.lines) return;
        if (this.localization.model.name === localization.model.name) return;

        localization.lines = this.objectKeysToLowerCase(localization.lines);
        this.localization = localization;

        this.localizationChange.emit();
    }

    private objectKeysToLowerCase(object: object) {
        const newObject = {};

        Object.keys(object).forEach(key => {
            newObject[key.toLowerCase()] = object[key];
        });

        return newObject;
    }

    /**
     * Check if i18n functionality is enabled.
     */
    private translationsEnabled(): boolean {
        return this.settings.get('i18n.enable');
    }
}
