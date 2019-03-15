import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {Modal} from "../../../core/ui/modal.service";
import {ValueLists} from "../../../core/services/value-lists.service";
import {SelectPermissionsModalComponent} from "../select-permissions-modal/select-permissions-modal.component";

export interface Permission {
    name: string;
    description?: string,
    state?: 1|0
}

@Component({
    selector: 'permissions-manager-panel',
    templateUrl: './permissions-manager-panel.component.html',
    styleUrls: ['./permissions-manager-panel.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PermissionsManagerPanelComponent implements OnInit {

    /**
     * All existing permissions.
     */
    private allPermissions: object;

    /**
     * If add new permissions panel is currently active.
     */
    public addNewPermissionsActive = false;

    /**
     * Internal permissions array.
     */
    _permissions: Permission[] = [];

    /**
     * Permissions model.
     */
    @Input() set permissions(permissions: {[key:string]: number}) {
        if ( ! permissions) return;

        this._permissions = Object.keys(permissions).map(permission => {
            return {name: permission, state: 1};
        }) as Permission[];
    }

    /**
     * Errors from backend.
     */
    @Input() public errors: {permissions?: string} = {};

    /**
     * Fired when permissions array changes.
     */
    @Output() public change = new EventEmitter();

    /**
     * PermissionsManagerPanelComponent Constructor.
     */
    constructor(private modal: Modal, private values: ValueLists) {}

    ngOnInit() {
        this.fetchAllPermissions();
    }

    /**
     * Show panel for attaching new permissions to plan.
     */
    public showAddPermissionsModal() {
        this.modal.open(SelectPermissionsModalComponent, {allPermissions: this.allPermissions})
            .afterClosed()
            .subscribe(permissions => {
                if ( ! permissions) return;
                this.addNewPermissions(permissions);
            });
    }

    /**
     * Remove given permission from model.
     */
    public removePermission(name: string) {
        const i = this._permissions.findIndex(permission => permission.name === name);
        this._permissions.splice(i, 1);
        this.emitChangeEvent();
    }

    /**
     * Add given permissions to model.
     */
    public addNewPermissions(permissions: string[]) {
        const array = permissions.map(name => {
            return {name: name, state: 1};
        }) as Permission[];

        this._permissions = this._permissions.concat(array);

        this.emitChangeEvent();
    }

    private emitChangeEvent() {
        let permissions = {};

        this._permissions.forEach(permission => {
            permissions[permission.name] = permission.state;
        });

        this.change.emit(permissions);
    }

    /**
     * fetch permissions list from backend.
     */
    private fetchAllPermissions() {
        this.values.getPermissions().subscribe(response => {
            this.allPermissions = response.permissions;
        });
    }
}
