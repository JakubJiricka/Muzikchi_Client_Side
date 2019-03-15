import {AppearanceFieldConfig} from "../../../core/config/vebto-config";

export const customCode: AppearanceFieldConfig = {
    name: 'Custom Code',
    fields: [
        {
            name: 'Custom CSS',
            type: 'code',
            key: 'custom_code.css',
            config: {language: 'css'}
        },
        {
            name: 'Custom Javascript',
            type: 'code',
            key: 'custom_code.js',
            config: {language: 'javascript'}
        }
    ]
};