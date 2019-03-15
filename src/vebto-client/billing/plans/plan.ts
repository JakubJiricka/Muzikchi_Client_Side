export class Plan {
    id: number;
    name: string;
    amount: number;
    currency: string;
    currency_symbol: string = '$';
    interval: 'day'|'week'|'month'|'year' = 'month';
    interval_count: number = 1;
    parent_id: number = null;
    parent?: Plan;
    permissions: object = {};
    recommended: 0|1 = 0;
    show_permissions: 0|1 = 0;
    free: 0|1 = 0;
    position: number = 0;
    features: string[] = [];

    constructor(params: Object = {}) {
        for (let name in params) {
            this[name] = params[name];
        }
    }
}