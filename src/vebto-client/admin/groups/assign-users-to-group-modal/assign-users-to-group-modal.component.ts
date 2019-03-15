import {Component, ViewEncapsulation, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {Group} from "../../../core/types/models/Group";
import {Toast} from "../../../core/ui/toast.service";
import {GroupService} from "../group.service";

export interface AssignUsersToGroupModalData {
    group?: Group
}

@Component({
    selector: 'assign-users-to-group-modal',
    templateUrl: './assign-users-to-group-modal.component.html',
    styleUrls: ['./assign-users-to-group-modal.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AssignUsersToGroupModalComponent implements OnInit{

    /**
     * Group users should be assigned to.
     */
    public group: Group;

    /*
     * Emails group should be assigned to.
     */
    public emails: any;

    /**
     * Errors returned from backend.
     */
    public errors: any = {};

    /**
     * AssignUsersToGroupModal Constructor.
     */
    constructor(
        private dialogRef: MatDialogRef<AssignUsersToGroupModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: AssignUsersToGroupModalData,
        private toast: Toast,
        private groupService: GroupService,
    ) {
        this.resetState();
    }

    public close(data?: any) {
        this.resetState();
        this.dialogRef.close(data);
    }

    ngOnInit() {
        this.resetState();
        this.group = this.data.group;
    }

    public confirm() {
        let emails = this.emails.map(function(obj) {
           return obj.email;
        });

        this.groupService.addUsers(this.group.id, emails).subscribe(response => {
            this.close(response);
            this.toast.open('Users assigned to group');
        }, () => this.errors = {emails: true});
    }

    /**
     * Reset all modal state to default.
     */
    private resetState() {
        //empty string is needed for initial input, because we're going
        //to loop through this array and show input for every value.
        this.emails = [{email: ''}];
        this.errors = {};
    }

    /**
     * Add input field to assign one more user to group
     */
    public assignMoreUsers() {
        this.emails.push({email: ''});
    }

    /**
     * Remove assignee at given index.
     */
    public removeUser(index: number) {

        //if there's only one email object, empty it
        if (this.emails.length === 1) {
            this.emails[index].email = '';
        }

        //otherwise remove the whole object (and input)
        else {
            this.emails.splice(index, 1);
        }
    }
}