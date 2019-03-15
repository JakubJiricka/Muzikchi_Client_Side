import {AppearanceFieldConfig} from "../../../core/config/vebto-config";

export const general: AppearanceFieldConfig = {
    name: 'General',
    fields: [
        {
            name: 'Logo #1 (on colored background)',
            type: 'image',
            key: 'branding.logo_light',
            image_type: 'src',
            selector: '.logo',
        },
        {
            name: 'Logo #2 (on white background)',
            type: 'image',
            key: 'branding.logo_dark',
            image_type: 'src',
            selector: '.logo',
        },
        {
            name: 'Favicon',
            type: 'image',
            key: 'branding.favicon',
        },
        {
            name: 'Site Name',
            type: 'text',
            key: 'branding.site_name',
        },
        {
            name: 'Site Url',
            type: 'text',
            input_type: 'url',
            key: 'env.app_url',
        }
    ]
};