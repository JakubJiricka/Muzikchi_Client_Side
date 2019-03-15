import {Component, Inject, ViewEncapsulation, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {LocalizationWithLines} from "../translations.component";
import {Localization} from "../../../core/types/models/Localization";
import {Localizations} from '../../../core/translations/localizations.service';
import {Observable} from 'rxjs';

export interface CrupdateLocalizationModalData {
    localization?: LocalizationWithLines
}

@Component({
    selector: 'crupdate-localization-modal',
    templateUrl: './crupdate-localization-modal.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class CrupdateLocalizationModalComponent implements OnInit {

    /**
     * Localization model.
     */
    public localization: LocalizationWithLines = {model: new Localization()};

    /**
     * Whether localization creation is currently in progress.
     */
    public loading = false;

    /**
     * Errors returned from backend.
     */
    public errors: any = {};

    /**
     * CrupdateLocalizationModalComponent Constructor.
     */
    constructor(
        private localizations: Localizations,
        private dialogRef: MatDialogRef<CrupdateLocalizationModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: CrupdateLocalizationModalData,
    ) {}

    ngOnInit() {
        if (this.data.localization) {
            this.localization = this.data.localization;
        }
    }

    /**
     * Create new localization or update existing one.
     */
    public confirm() {
        this.loading = true;

        let request = this.localization.model.id ? this.updateLocalization() : this.createNewLocalization();

        request.subscribe(response => {
            this.loading = false;
            this.close(response.localization);
        }, errors => {
            this.loading = false;
            this.handleErrors(errors);
        });
    }

    /**
     * Close the modal and pass specified data.
     */
    public close(localization?: LocalizationWithLines) {
        this.dialogRef.close(localization);
    }

    /**
     * Create a new localization.
     */
    public createNewLocalization(): Observable<{localization: LocalizationWithLines}> {
        return this.localizations.create(this.getPayload());
    }

    /**
     * Update existing localization.
     */
    public updateLocalization(): Observable<{localization: LocalizationWithLines}> {
        return this.localizations.update(this.localization.model.id, this.getPayload());
    }

    /**
     * Get payload for creating/updating localization.
     */
    private getPayload() {
        return {name: this.localization.model.name};
    }

    /**
     * Format errors received from server for display.
     */
    public handleErrors(response?: {messages: object}) {
        //clear old errors if no response is specified
        if ( ! response) return this.errors = {};

        this.errors = response.messages;
        this.loading = false;
    }
}