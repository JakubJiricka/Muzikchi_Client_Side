import {Component, NgZone, ViewEncapsulation, OnInit, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

export interface RequestExtraCredentialsModalData {
    credentials: string[]
}

@Component({
    selector: 'request-extra-credentials-modal',
    templateUrl: './request-extra-credentials-modal.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class RequestExtraCredentialsModalComponent implements OnInit {

    /**
     * Model for extra credentials.
     */
    public model: {email?: string, password?: string} = {};

    /**
     * What extra credentials need to be requested.
     */
    public credentialsToRequest: string[];

    public errors: {email?: string, password?: string} = {};

    /**
     * RequestExtraCredentialsModalComponent Constructor.
     */
    constructor(
        private dialogRef: MatDialogRef<RequestExtraCredentialsModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: RequestExtraCredentialsModalData,
        private zone: NgZone
    ) {}

    ngOnInit() {
        this.zone.run(() => {
            this.credentialsToRequest = this.data.credentials;
        });
    }

    /**
     * Should we request specified credential from user.
     */
    public shouldCredentialBeRequested(name: string): boolean {
        return this.credentialsToRequest.indexOf(name) > -1;
    }

    /**
     * Submit extra credentials.
     */
    public confirm() {
        this.dialogRef.close(Object.assign({}, this.model));
    }

    /**
     * Close modal and reset it to initial state.
     */
    public close() {
        this.dialogRef.close();
    }

    public handleErrors(response: {messages: object}) {
        //we need to request user extra credentials again, for example
        //if email address user supplied previously already exists
        //we might need to request password for account with that email
        if (response['messages']['email']) {
            this.credentialsToRequest.push('password');
        }

        this.zone.run(() => {
            this.errors = response.messages;
        });
    }
}