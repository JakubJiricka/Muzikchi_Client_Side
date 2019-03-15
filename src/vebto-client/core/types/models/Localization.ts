export class Localization {
	id: number;
	name: string;
	created_at?: string;
	updated_at?: string;

	constructor(params: Object = {}) {
        for (let name in params) {
            this[name] = params[name];
        }
    }
}