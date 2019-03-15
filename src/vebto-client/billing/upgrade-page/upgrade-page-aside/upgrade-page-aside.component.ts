import {Component, Input, ViewEncapsulation} from '@angular/core';
import {Plan} from "../../plans/plan";

@Component({
    selector: 'upgrade-page-aside',
    templateUrl: './upgrade-page-aside.component.html',
    styleUrls: ['./upgrade-page-aside.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class UpgradePageAsideComponent {

    @Input() plan: Plan;
}
