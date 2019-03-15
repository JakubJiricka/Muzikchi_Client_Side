import {Component, ViewEncapsulation} from '@angular/core';
import {AppearanceEditor} from "../appearance-editor/appearance-editor.service";
import {MenuEditor} from "../menus/menu-editor.service";
import {Menu} from "../menus/menu";
import {Modal} from "../../../core/ui/modal.service";
import {Settings} from "../../../core/config/settings.service";
import {ConfirmModalComponent} from "../../../core/ui/confirm-modal/confirm-modal.component";

@Component({
    selector: 'menus-appearance-panel',
    templateUrl: './menus-appearance-panel.component.html',
    styleUrls: ['./menus-appearance-panel.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class MenusAppearancePanelComponent {

    /**
     * Whether new menu item panel is currently visible.
     */
    public newMenuItemPanelActive = false;

    /**
     * HelpCenterHomeAppearance Constructor.
     */
    constructor(
        public appearance: AppearanceEditor,
        public menus: MenuEditor,
        private modal: Modal,
        private settings: Settings,
    ) {
        this.menus.setFromJson(this.settings.get('menus'));
    }

    /**
     * Toggle new menu item panel visibility.
     */
    public toggleNewMenuItemPanel() {
        this.newMenuItemPanelActive = !this.newMenuItemPanelActive;
    }

    /**
     * Open previous appearance panel.
     */
    public openPreviousPanel() {
        //if menu panel is open, close it
        if (this.menus.activeMenu) {
            this.menus.activeMenu = null;
        }
        //otherwise navigate back to main appearance panel
        else {
            this.appearance.closeActivePanel();
        }
    }

    /**
     * Open specified menu panel.
     */
    public setActiveMenu(menu: Menu) {
        this.menus.activeMenu = menu;
    }

    /**
     * Ask user to confirm menu deletion.
     */
    public confirmMenuDeletion() {
        this.modal.show(ConfirmModalComponent, {
            title: 'Delete Menu',
            body: 'Are you sure you want to delete this menu?',
            ok: 'Delete'
        }).afterClosed().subscribe(confirmed => {
            if ( ! confirmed) return;
            this.menus.deleteActive();
        });
    }
}
