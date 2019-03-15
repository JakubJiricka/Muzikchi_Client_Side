import {Component, ViewEncapsulation, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSelectionListChange} from "@angular/material";

export interface SelectPermissionsModalData {
    allPermissions: object
}

@Component({
    selector: 'select-permissions-modal',
    templateUrl: './select-permissions-modal.component.html',
    styleUrls: ['./select-permissions-modal.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class SelectPermissionsModalComponent {

    /**
     * Permissions that are selected.
     */
    public selectedPermissions: string[] = [];

    /**
     * Permissions that should not be selectable.
     */
    public disabledPermissions: string[] = [];

    /**
     * SelectPermissionsModalComponent Constructor.
     */
    constructor(
        private dialogRef: MatDialogRef<SelectPermissionsModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: SelectPermissionsModalData,
    ) {}

    /**
     * Close modal and return selected permissions to caller.
     */
    public confirm() {
        this.close(this.selectedPermissions);
    }

    /**
     * Close the modal and pass specified data.
     */
    public close(data?) {
        this.dialogRef.close(data);
    }

    /**
     * Check if given group is currently selected.
     */
    public isPermissionSelected(item: string) {
        return this.selectedPermissions.indexOf(item) > -1;
    }

    /**
     * Should specified group be disabled (not selectable).
     */
    public isPermissionDisabled(id: string) {
        return this.disabledPermissions.indexOf(id) > -1;
    }

    /**
     * Selected or deselect specified group.
     */
    public toggleSelectedPermission(change: MatSelectionListChange) {
        const permission = change.option.value,
              index = this.selectedPermissions.indexOf(permission);

        if (index > -1) {
            this.selectedPermissions.splice(index, 1);
        } else {
            this.selectedPermissions.push(permission);
        }
    }
}
