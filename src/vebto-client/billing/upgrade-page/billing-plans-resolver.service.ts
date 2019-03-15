import {Injectable} from '@angular/core';
import {Resolve, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import {Plans} from "../plans/plans.service";
import {Plan} from "../plans/plan";
import {map} from "rxjs/operators";

@Injectable()
export class BillingPlansResolver implements Resolve<Plan[]> {

    constructor(private plans: Plans) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Plan[]> {
        return this.plans.all({order: 'position|asc'}).pipe(map(response => response.data)).toPromise();
    }
}

