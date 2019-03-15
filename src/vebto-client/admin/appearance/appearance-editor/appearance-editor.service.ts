import {ElementRef, Injectable} from '@angular/core';
import {AppearancePendingChanges} from "./appearance-pending-changes.service";
import {NavigationStart, RouterEvent} from "@angular/router";
import {filter} from "rxjs/operators";
import {Settings} from "../../../core/config/settings.service";
import {Toast} from "../../../core/ui/toast.service";
import {utils} from "../../../core/services/utils";
import {PreviewApp} from "../../../core/services/preview-app.service";
import {VebtoConfigAppearance} from '../../../core/config/vebto-config';
import {AppearanceModule} from '../appearance.module';

@Injectable({
    providedIn: AppearanceModule
})
export class AppearanceEditor {

    /**
     * Currently active appearance panel.
     */
    public activePanel: string;

    /**
     * All default settings for the application.
     */
    public defaultSettings: {name: string, value: any}[];

    /**
     * Appearance editor configuration.
     */
    public config: VebtoConfigAppearance;

    /**
     * Whether preview is currently loading.
     */
    public isLoading = false;

    private previewAngular: PreviewApp;

    private previewDocument: Document;

    /**
     * Element used for displaying outline around selected element.
     */
    public selectedElBox: HTMLElement;

    /**
     * Preview element that is currently highlighted.
     */
    private highlightedElement: HTMLElement;

    /**
     * AppearanceEditor Constructor.
     */
    constructor(
        public changes: AppearancePendingChanges,
        private settings: Settings,
        private toast: Toast,
    ) {}

    /**
     * Initiate appearance editor.
     */
    public init(previewContainer: ElementRef, selectedBox: ElementRef, defaultSettings: {name: string, value: any}[]) {
        this.defaultSettings = defaultSettings;
        this.selectedElBox = selectedBox.nativeElement;
        this.config = this.settings.get('vebto.admin.appearance');

        this.hydrateSeoSection();

        const colors = this.defaultSettings.find(setting => setting.name === 'colors');

        this.config.sections.colors.fields = colors.value.map(color => {
            return {name: color.display_name, type: 'color', key: color.name, value: color.value};
        });

        this.initIframe(previewContainer);
        this.setFieldValues();
    }

    /**
     * Notify currently active tab to save its changes.
     */
    public saveChanges() {
        this.changes.save();
    }

    /**
     * Close currently active preview panel and navigate to default url.
     */
    public closeActivePanel() {
        this.activePanel = null;
        this.navigate();
    }

    /**
     * Navigate preview angular to specified route.
     */
    public navigate(route?: string) {
        if ( ! route) route = this.config.defaultRoute;
        if ( ! this.previewAngular) return;
        this.previewAngular.router.navigate([route]);
    }

    /**
     * Apply specified setting to preview angular instance.
     */
    public applySetting(name: string, value: string|number, emitChanges: boolean = false) {
        this.previewAngular.zone.run(() => {
            this.previewAngular.settings.set(name, value, emitChanges);
        })
    }

    /**
     * Highlight element in live preview by specified selector.
     */
    public highlightElement(selector: string, index = 0) {
        if ( ! selector) return;

        this.highlightedElement = this.getDocument().querySelectorAll(selector)[index] as HTMLElement;
        if ( ! this.highlightedElement) return;

        let rect = this.highlightedElement.getBoundingClientRect();

        this.selectedElBox.style.width = rect.width + 'px';
        this.selectedElBox.style.height = rect.height + 'px';
        this.selectedElBox.style.top = rect.top + 'px';
        this.selectedElBox.style.left = rect.left + 'px';
        this.selectedElBox.style.borderRadius = this.highlightedElement.style.borderRadius;
    }

    /**
     * Remove highlight element box from view.
     */
    public removeHighlight() {
        this.selectedElBox.style.width = '0px';
        this.selectedElBox.style.height = '0px';
        this.selectedElBox.style.left = '-15px';
        this.selectedElBox.style.top = '-15px';
    }

    public getDocument(): Document {
        return this.previewDocument || new Document();
    }

    private initIframe(previewContainer: ElementRef) {
        const iframe = document.createElement('iframe');

        iframe.onload = () => {
            utils.poll(() => {
                return iframe.contentWindow['previewAngular'];
            }).then(() => {
                this.previewAngular = iframe.contentWindow['previewAngular'];
                this.blockNotAllowedRoutes();
                this.previewDocument = iframe.contentDocument;
            }).catch(e => {
                console.log(e);
            });
        };

        iframe.src = this.settings.getBaseUrl() + this.config.defaultRoute + '?token=' + this.settings.csrfToken;
        previewContainer.nativeElement.appendChild(iframe);
    }

    /**
     * Block preview navigation to routes that are not allowed.
     */
    private blockNotAllowedRoutes() {
        this.previewAngular.router.events
            .pipe(filter(e => e.toString().indexOf('NavigationStart') === 0))
            .subscribe((e: RouterEvent) => {
                if (e.url === '/') return;

                //route exists in config, bail
                const routes = this.config.navigationRoutes;
                if (routes.find(route => e.url.indexOf(route) > -1)) return;

                //prevent navigation to routes not specified in config
                let current = this.previewAngular.router.url.split('?')[0];
                this.previewAngular.router.navigate([current], {queryParamsHandling: 'preserve'});

                setTimeout(() => this.toast.open('That page is not supported by the editor.'));
            });
    }

    /**
     * Set stored and default values on editable fields.
     */
    private setFieldValues() {
        Object.keys(this.config.sections).forEach(key => {
            const configItem = this.config.sections[key];

            if (configItem.name.toLowerCase() === 'colors') return;

            configItem.fields.forEach(field => {
                field.value = this.getCurrentSetting(field.key);
                field.defaultValue = this.getDefaultSetting(field.key);
            });
        })
    }

    private getCurrentSetting(key: string) {
        if (key.startsWith('env.')) {
            return this.getDefaultSetting('env')[key];
        } else {
            return this.settings.get(key);
        }
    }

    /**
     * Get default setting by specified name.
     */
    public getDefaultSetting(name: string) {
        let setting = this.defaultSettings.find(setting => setting.name === name);
        return setting ? setting.value : null;
    }

    private hydrateSeoSection() {
        const existing = this.config.sections.seo.fields.map(item => item.key);

        const seoFields = this.defaultSettings.find(setting => setting.name === 'seo_fields').value;

        seoFields.forEach(field => {
            if (existing.indexOf(field.name) > -1) return;
            const name = field.name.replace(/_/g, ' ').replace('seo.', '');
            this.config.sections.seo.fields.push({key: field.name, name});
        });
    }
}
