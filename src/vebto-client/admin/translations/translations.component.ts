import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormControl} from "@angular/forms";
import {CrupdateLocalizationModalComponent} from "./crupdate-localization-modal/crupdate-localization-modal.component";
import {ActivatedRoute} from "@angular/router";
import {CurrentUser} from "vebto-client/auth/current-user";
import {MatTableDataSource} from "@angular/material";
import {Settings} from "../../core/config/settings.service";
import {Localization} from "../../core/types/models/Localization";
import {Modal} from "../../core/ui/modal.service";
import {ConfirmModalComponent} from "../../core/ui/confirm-modal/confirm-modal.component";
import {Toast} from "../../core/ui/toast.service";
import {distinctUntilChanged} from "rxjs/operators";
import {Translations} from '../../core/translations/translations.service';
import {Localizations} from '../../core/translations/localizations.service';

@Component({
    selector: 'translations',
    templateUrl: './translations.component.html',
    styleUrls: ['./translations.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class TranslationsComponent implements OnInit {

    /**
     * Data source for translations table.
     */
    public tableDataSource: MatTableDataSource<{key: string, translation: string}>;

    /**
     * Control for categories search field.
     */
    public searchQuery = new FormControl();

    /**
     * Currently selected language.
     */
    public selectedLocalization: LocalizationWithLines = {model: new Localization, lines: {}};

    /**
     * All user created localizations.
     */
    public localizations: LocalizationWithLines[] = [];

    /**
     *LocalizationsComponent Constructor.
     */
    constructor(
        private toast: Toast,
        private modal: Modal,
        private settings: Settings,
        private i18n: Translations,
        private route: ActivatedRoute,
        public currentUser: CurrentUser,
        private localizationsApi: Localizations
    ) {}

    ngOnInit() {
        this.bindSearchQuery();
        this.tableDataSource = new MatTableDataSource();

        this.route.data.subscribe(data => {
            this.setLocalizations(data.localizations);
        });
    }

    /**
     * Set default localization language for the site.
     */
    public setDefaultLocalization(localization: LocalizationWithLines) {
        if ( ! this.selectedLocalization.model.id) this.setSelectedLocalization(localization);

        this.localizationsApi.setDefault(localization.model.name).subscribe(() => {
            this.toast.open('Default Localization Changed');
        });
    }

    /**
     * Update currently selected localization.
     */
    public updateLocalization() {
        this.localizationsApi.update(this.selectedLocalization.model.id, this.selectedLocalization).subscribe(() => {
            this.toast.open('Localizations updated');

            if (this.selectedLocalization.model.id === this.i18n.getActive().model.id) {
                this.i18n.setLocalization(this.selectedLocalization);
            }
        });
    }

    /**
     * Show modal for updating existing localization or creating new one.
     */
    public showCrupdateLocalizationModal(localization?: LocalizationWithLines) {
        this.modal.show(CrupdateLocalizationModalComponent, {localization}).afterClosed().subscribe((loc: LocalizationWithLines) => {
            if ( ! loc) return;

            if (localization) {
                localization = loc;
            } else {
                this.localizations.push(loc);
                this.setSelectedLocalization(loc);
            }
        });
    }

    /**
     * Fetch currently selected localization
     * (if needed) including its translations.
     */
    public setSelectedLocalization(localization: LocalizationWithLines) {
        if (this.selectedLocalization.model.id === localization.model.id) return;

        this.selectedLocalization = localization;
        this.tableDataSource.data = this.linesToArray(localization.lines);
        this.searchQuery.setValue(null);

        //if lang lines are already fetched for this localization, bail
        if (this.tableDataSource.data.length || ! localization.model.name) return;

        this.localizationsApi.get(this.selectedLocalization.model.name).subscribe(response => {
            this.selectedLocalization = response.localization;
            const i = this.localizations.findIndex(loc => loc.model.id === localization.model.id);
            this.localizations[i] = response.localization;
            this.tableDataSource.data = this.linesToArray(response.localization.lines);
        });
    }

    /**
     * Ask user to confirm selected language deletion.
     */
    public confirmLocalizationDeletion(language: LocalizationWithLines) {
        if (this.localizations.length < 2) {
            this.toast.open('There must be at least one localization.');
            return;
        }

        this.modal.open(ConfirmModalComponent, {
            title: 'Delete Localization',
            body: 'Are you sure you want to delete this localization?',
            ok: 'Delete'
        }).afterClosed().subscribe(confirmed => {
            if ( ! confirmed) return;
            this.deleteLocalization(language);
        });
    }

    /**
     * Delete currently selected language.
     */
    private deleteLocalization(language: LocalizationWithLines) {
        this.localizationsApi.delete(language.model.id).subscribe(() => {
            this.toast.open('Localization deleted');
            this.localizations.splice(this.localizations.indexOf(language), 1);

            if (this.selectedLocalization.model.id === language.model.id) {
                this.setSelectedLocalization(this.localizations[0]);
            }
        })
    }

    /**
     * Set specified localizations on component.
     */
    private setLocalizations(localizations: LocalizationWithLines[]) {
        this.localizations = localizations;

        this.localizations.forEach(localization => {
            if (localization.model.name === this.settings.get('i18n.default_localization')) {
                this.setSelectedLocalization(localization);
            }
        });
    }

    /**
     * Bind search query input.
     */
    private bindSearchQuery() {
        this.searchQuery
            .valueChanges
            .pipe(distinctUntilChanged())
            .subscribe(query => {
                this.tableDataSource.filter = (query || '').toLowerCase().trim();
            });
    }

    /**
     * Transform specified translation lines object to array.
     */
    private linesToArray(lines: object): {key: string, translation: string}[] {
        const transformed = [];

        for (let key in lines) {
            transformed.push({key, translation: lines[key]});
        }

        return transformed;
    }
}

export interface LocalizationWithLines {
    model: Localization;
    lines?: {[key: string]: string},
}
