import {Localization} from './models/Localization';

export interface LocalizationWithLines {
    model: Localization;
    lines?: {[key: string]: string},
}