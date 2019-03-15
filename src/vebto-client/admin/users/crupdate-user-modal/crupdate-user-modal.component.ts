import {Component, Inject, ViewEncapsulation, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {User} from "../../../core/types/models/User";
import {Users} from "../../../auth/users.service";
import {Toast} from "../../../core/ui/toast.service";

export interface CrupdateUserModalData {
    user?: User
}

@Component({
    selector: 'crupdate-user-modal',
    templateUrl: './crupdate-user-modal.component.html',
    styleUrls: ['./crupdate-user-modal.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class CrupdateUserModalComponent implements OnInit {

    /**
     * User model.
     */
    public model: User;

    /**
     * If we are updating existing user or creating a new one.
     */
    public updating: boolean = false;

    /**
     * Errors returned from backend.
     */
    public errors: any = {};

    /**
     * CrupdateUserModalComponent Constructor.
     */
    constructor(
        private dialogRef: MatDialogRef<CrupdateUserModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: CrupdateUserModalData,
        public users: Users,
        private toast: Toast
    ) {
        this.resetState();
    }

    ngOnInit() {
        this.resetState();

        if (this.data.user) {
            this.updating = true;
            this.hydrateModel(this.data.user);
        } else {
            this.updating = false;
        }
    }

    /**
     * Create a new user or update existing one.
     */
    public confirm() {
        let request, payload = this.getPayload();

        if (this.updating) {
            request = this.users.update(payload.id, payload);
        } else {
            request = this.users.create(payload);
        }

        request.subscribe(response => {
            this.close(response.data);
            let action = this.updating ? 'updated' : 'created';
            this.toast.open('User has been '+action);
        }, response => {
            this.handleErrors(response);
        });
    }

    /**
     * Close the modal.
     */
    public close(data?: any) {
        this.resetState();
        this.dialogRef.close(data);
    }

    /**
     * Get payload for updating or creating a user.
     */
    private getPayload() {
        let payload = Object.assign({}, this.model) as any;
        payload.groups = payload.groups.map(group => group.id);
        return payload;
    }

    /**
     * Reset all modal state to default.
     */
    private resetState() {
        this.model = new User({groups: []});
        this.errors = {};
    }

    /**
     * Populate user model with given data.
     */
    private hydrateModel(user) {
        Object.assign(this.model, user);
    }

    /**
     * Format errors received from backend.
     */
    public handleErrors(response: {messages: object} = {messages: {}}) {
        this.errors = response.messages;
    }
}