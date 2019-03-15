import {Component, ElementRef, OnInit, ViewEncapsulation} from '@angular/core';
import {Settings} from '../../../core/config/settings.service';

@Component({
    selector: 'accepted-payments-header',
    templateUrl: './accepted-payments-header.component.html',
    styleUrls: ['./accepted-payments-header.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AcceptedPaymentsHeaderComponent implements OnInit {

    public acceptedCards: string[] = [];

    constructor(private settings: Settings, public el: ElementRef) {}

    ngOnInit() {
        this.acceptedCards = this.settings.getJson('billing.accepted_cards', []);
    }

    /**
     * Get specified credit card's icon url.
     */
    public getCardIcon(card: string) {
        return this.settings.getAssetUrl() + 'images/billing/'+card+'.png';
    }
}
