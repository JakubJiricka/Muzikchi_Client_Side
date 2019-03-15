import {Component, ViewEncapsulation, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {Group} from "../../../core/types/models/Group";
import {Toast} from "../../../core/ui/toast.service";
import {GroupService} from "../group.service";
import {Modal} from "../../../core/ui/modal.service";

export interface CrupdateGroupModalData {
    group: Group
}

@Component({
    selector: 'crupdate-group-modal',
    templateUrl: './crupdate-group-modal.component.html',
    styleUrls: ['./crupdate-group-modal.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class CrupdateGroupModalComponent {

    /**
     * Group model.
     */
    public model: Group;

    /**
     * If we are updating existing group or creating a new one.
     */
    public updating: boolean = false;

    /**
     * Errors returned from backend.
     */
    public errors: any = {};

    /**
     * CrupdateGroupModalComponent Constructor.
     */
    constructor(
        private toast: Toast,
        private groupService: GroupService,
        private modal: Modal,
        private dialogRef: MatDialogRef<CrupdateGroupModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: CrupdateGroupModalData,
    ) {
        this.resetState();
    }

    ngOnInit() {
        this.resetState();

        if (this.data.group) {
            this.updating = true;
            this.hydrateModel(this.data.group);
        } else {
            this.updating = false;
        }
    }

    public close(data = null) {
        this.resetState();
        this.dialogRef.close(data);
    }

    public confirm() {
        let request;

        if (this.updating) {
            request = this.groupService.update(this.model.id, Object.assign({}, this.model));
        } else {
            request = this.groupService.createNew(Object.assign({}, this.model));
        }

        request.subscribe(response => {
            this.toast.open('Group '+this.updating ? 'Updated' : 'Created');
            this.close(response.data);
        }, this.handleErrors.bind(this));
    }

    /**
     * Reset all modal state to default.
     */
    private resetState() {
        this.model = new Group({'default': 0, permissions: {}});
        this.errors = {};
    }

    /**
     * Populate group model with given data.
     */
    private hydrateModel(group) {
        Object.assign(this.model, group);
    }

    /**
     * Format errors received from backend.
     */
    public handleErrors(response: {messages: object} = {messages: {}}) {
        this.errors = response.messages;
    }
}