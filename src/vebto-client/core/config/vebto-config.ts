import {environment} from "../../../environments/environment";
import {InjectionToken} from '@angular/core';

export const APP_CONFIG = new InjectionToken<VebtoConfig[]>('APP_CONFIG');

export interface VebtoConfigAppearance {
    navigationRoutes: string[],
    defaultRoute: string,
    sections: {[key: string]: AppearanceFieldConfig},
    menus: {
        availableRoutes: string[],
        positions: string[],
    }
}

export interface AppearanceFieldConfig {
    name: string,
    route?: string,
    fields: AppearanceEditableField[],
}

export interface AppearanceEditableField {
    name: string,
    display_name?: string,
    type?: 'code'|'color'|'image'|'text',
    key: string,
    value?: any,
    defaultValue?: any,
    image_type?: string,
    input_type?: string,
    selector?: string,
    config?: { [key: string]: any };
}

export const DEFAULT_VEBTO_CONFIG: VebtoConfig = {
    environment: environment.production ? 'production' : 'dev',
    assetsPrefix: null,
    auth: {
        //Route users should be redirected to after successful login.
        redirectUri: '/',
        //Route admins should be redirected to after successful login.
        adminRedirectUri: '/'
    },
    accountSettings: {
        hideNavbar: false,
    },
    customPages: {
        hideNavbar: false,
    }
};

export interface VebtoConfig {

    [key: string]: any,

    //scrollbar
    forceCustomScrollbar?: boolean,

    //backend stuff
    base_url?: string,
    version?: string,
    'homepage.type'?: string,
    'homepage.value'?: string,
    'logging.sentry_public'?: string,
    'dates.format'?: string,
    'ads.disable'?: boolean,
    menus?: string,
    'i18n.enable'?: boolean,
    'branding.site_name'?: string,
    'toast.default_timeout'?: number,

    //vebto config
    environment?: 'production'|'dev',
    assetsPrefix?: string|null,
    auth?: {
        redirectUri?: string,
        adminRedirectUri?: string,
    },
    accountSettings?: {
        hideNavbar?: boolean,
    }
    navbar?: {
        defaultPosition: string,
        dropdownItems: {route: string, name: string, icon: string}[],
    },
    admin?: {
        appearance: VebtoConfigAppearance,
        analytics?: {stats: {name: string, icon: string}[]},
        ads?: {slot: string, description: string}[],
        pages: {name: string, icon: string, route: string, permission: string}[],
        settingsPages?: {name: string, route: string}[],
    }
}