import {AfterViewInit, Component, OnDestroy, ViewChild, ViewEncapsulation} from '@angular/core';
import {MenuItem} from "../menu-item";
import {MenuEditor} from "../menu-editor.service";
import {Subscription} from "rxjs";
import {Modal} from "../../../../core/ui/modal.service";
import {ConfirmModalComponent} from "../../../../core/ui/confirm-modal/confirm-modal.component";

@Component({
    selector: 'menu-items',
    templateUrl: './menu-items.component.html',
    styleUrls: ['./menu-items.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class MenuItemsComponent implements AfterViewInit, OnDestroy {

    /**
     * Currently selected menu item, if any.
     */
    public selectedMenuItem: MenuItem;

    /**
     * Active component subscriptions.
     */
    public subscriptions: Subscription[] = [];

    /**
     * MenuItemsComponent Constructor.
     */
    constructor(public menus: MenuEditor, private modal: Modal) {}

    ngAfterViewInit() {
        this.initSorter();
    }

    /**
     * Toggle specified menu item settings panel visibility.
     */
    public toggleMenuItem(item: MenuItem) {
        if (this.selectedMenuItem === item) {
            this.selectedMenuItem = null;
        } else {
            this.selectedMenuItem = item;
        }
    }

    /**
     * Ask user to confirm menu item deletion.
     */
    public confirmMenuItemDeletion() {
        this.modal.show(ConfirmModalComponent, {
            title: 'Delete Menu Item',
            body: 'Are you sure you want to delete this menu item?',
            ok: 'Delete'
        }).afterClosed().subscribe(confirmed => {
            if ( ! confirmed) return;
            this.menus.deleteMenuItem(this.selectedMenuItem);
            this.selectedMenuItem = null;
        });
    }

    /**
     * Initiate menu items sorter and refresh it after menu items change.
     */
    private initSorter() {
        // this.sorter.refresh();
        // this.menus.itemsChange.subscribe(() => setTimeout(() => this.sorter.refresh()));
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => {
            subscription && subscription.unsubscribe();
        });
    }
}
