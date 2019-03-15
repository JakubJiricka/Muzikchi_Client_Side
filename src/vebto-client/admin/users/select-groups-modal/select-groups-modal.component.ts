import {Component, ViewEncapsulation, OnInit, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSelectionListChange} from "@angular/material";
import {Group} from "../../../core/types/models/Group";
import {GroupService} from "../../groups/group.service";

export interface SelectGroupsModalData {
    selected?: number[]
}

@Component({
    selector: 'select-groups-modal',
    templateUrl: './select-groups-modal.component.html',
    styleUrls: ['./select-groups-modal.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class SelectGroupsModalComponent implements OnInit {

    /**
     * All existing groups.
     */
    public groups: Group[] = [];

    /**
     * Currently selected groups.
     */
    public selectedGroups: number[] = [];

    /**
     * Groups that should not be selectable.
     */
    public disabledGroups: number[] = [];

    /**
     * SelectGroupModalComponent Constructor.
     */
    constructor(
        private groupsService: GroupService,
        private dialogRef: MatDialogRef<SelectGroupsModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: SelectGroupsModalData,
    ) {}

    public ngOnInit() {
        this.fetchAllGroups();
        this.disabledGroups = this.data.selected;
    }

    /**
     * Close modal and return selected groups to caller.
     */
    public confirm() {
        this.close(this.selectedGroups);
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
    public isGroupSelected(item: number) {
        return this.selectedGroups.indexOf(item) > -1;
    }

    /**
     * Should specified group be disabled (not selectable).
     */
    public isGroupDisabled(id: number) {
        return this.disabledGroups.indexOf(id) > -1;
    }

    /**
     * Selected or deselect specified group.
     */
    public toggleSelectedGroup(change: MatSelectionListChange) {
        const groupId = change.option.value,
              index = this.selectedGroups.indexOf(groupId);

        if (index > -1) {
            this.selectedGroups.splice(index, 1);
        } else {
            this.selectedGroups.push(groupId);
        }
    }

    /**
     * Set all available groups on component,
     * if not provided fetch from the server.
     */
    private fetchAllGroups() {
        this.groupsService.getGroups()
            .subscribe(response => this.groups = response.data);
    }
}
