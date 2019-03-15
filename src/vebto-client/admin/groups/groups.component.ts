import {Component, OnInit, ViewChild, ViewEncapsulation} from "@angular/core";
import {CrupdateGroupModalComponent} from "./crupdate-group-modal/crupdate-group-modal.component";
import {AssignUsersToGroupModalComponent} from "./assign-users-to-group-modal/assign-users-to-group-modal.component";
import {CurrentUser} from "../../auth/current-user";
import {UrlAwarePaginator} from "../pagination/url-aware-paginator.service";
import {MatSort} from "@angular/material";
import {User} from "../../core/types/models/User";
import {Group} from "../../core/types/models/Group";
import {GroupService} from "./group.service";
import {Toast} from "../../core/ui/toast.service";
import {Modal} from "../../core/ui/modal.service";
import {ConfirmModalComponent} from "../../core/ui/confirm-modal/confirm-modal.component";
import {PaginatedDataTableSource} from '../data-table/data/paginated-data-table-source';

@Component({
    selector: 'groups',
    templateUrl: './groups.component.html',
    styleUrls: ['./groups.component.scss'],
    providers: [UrlAwarePaginator],
    encapsulation: ViewEncapsulation.None,
})
export class GroupsComponent implements OnInit {
    @ViewChild(MatSort) matSort: MatSort;

    public dataSource: PaginatedDataTableSource<User>;

    /**
     * List of all available groups models.
     */
    public groups: Group[];

    /**
     * Currently selected group.
     */
    public selectedGroup: Group = new Group();

    /**
     * GroupsComponent Constructor.
     */
    constructor(
        private groupService: GroupService,
        private toast: Toast,
        private modal: Modal,
        public paginator: UrlAwarePaginator,
        public currentUser: CurrentUser,
    ) {}

    ngOnInit() {
        this.dataSource = new PaginatedDataTableSource<User>({
            uri: 'users',
            dataPaginator: this.paginator,
            matSort: this.matSort
        });

        this.refreshGroups().then(() => {
            this.dataSource.init({group_id: this.selectedGroup.id});
        });
    }

    /**
     * Set given group as selected.
     */
    public selectGroup(group: Group) {
        if (this.selectedGroup !== group) {
            this.selectedGroup = group;
            this.refreshGroupUsers(group);
            this.dataSource.selectedRows.clear();
        }
    }

    /**
     * Fetch all existing groups.
     */
    public refreshGroups() {
        return new Promise(resolve => {
            this.groupService.getGroups().subscribe(response => {
                this.groups = response.data;

                if (this.groups.length) {
                    //if no group is currently selected, select first
                    if ( ! this.selectedGroup || ! this.selectedGroup.id) {
                        this.selectGroup(this.groups[0]);

                        //if group is selected, try to re-select it with the one returned from server
                    } else {
                        for (let i = 0; i < this.groups.length; i++) {
                            if (this.groups[i].id == this.selectedGroup.id) {
                                this.selectedGroup = this.groups[i];
                            }
                        }
                    }
                }

                resolve();
            });
        });
    }

    /**
     * Refresh users belonging to specified group.
     */
    public refreshGroupUsers(group: Group) {
        this.dataSource.setParams({group_id: group.id});
    }

    /**
     * Show modal for assigning new users to currently selected group.
     */
    public showAssignUsersModal() {
        this.modal.show(AssignUsersToGroupModalComponent, {group: this.selectedGroup}).afterClosed().subscribe(data => {
            if ( ! data) return;
            this.refreshGroupUsers(this.selectedGroup);
        })
    }

    /**
     * Show modal for editing user if user is specified
     * or for creating a new user otherwise.
     */
    public showCrupdateGroupModal(group?: Group) {
        this.modal.show(CrupdateGroupModalComponent, {group}).afterClosed().subscribe(data => {
            if ( ! data) return;
            this.refreshGroups();
        });
    }

    /**
     * Ask user to confirm deletion of selected group
     * and delete selected group if user confirms.
     */
    public maybeDeleteGroup(group: Group) {
        this.modal.open(ConfirmModalComponent, {
            title: 'Delete Group',
            body:  'Are you sure you want to delete this group?',
            ok:    'Delete'
        }).afterClosed().subscribe(confirmed => {
            if ( ! confirmed) return;
            this.deleteGroup(group);
        });
    }

    /**
     * Delete specified group.
     */
    public deleteGroup(group: Group) {
        this.groupService.delete(group.id).subscribe(() => {
            this.selectedGroup = new Group();
            this.refreshGroups().then(() => {
                this.refreshGroupUsers(this.selectedGroup);
            });
        });
    }

    /**
     * Ask user to confirm detachment of selected users from
     * currently selected group, and detach them if user confirms.
     */
    public maybeDetachUsers() {
        this.modal.show(ConfirmModalComponent, {
            title: 'Remove users from group',
            body:  'Are you sure you want to remove selected users from this group?',
            ok:    'Remove'
        }).afterClosed().subscribe(confirmed => {
            if ( ! confirmed) return;
            this.removeUsersFromSelectedGroup();
        });
    }

    /**
     * Remove users from selected group.
     */
    public removeUsersFromSelectedGroup() {
        const ids = this.dataSource.selectedRows.selected.map(user => user.id);

        this.groupService.removeUsers(this.selectedGroup.id, ids).subscribe(() => {
            this.refreshGroupUsers(this.selectedGroup);
            this.dataSource.selectedRows.clear();
            this.toast.open('Users removed from group.');
        });
    }

    /**
     * Check if users can be assigned to selected group.
     */
    public canAssignUsers() {
        return this.selectedGroup.id && !this.dataSource.selectedRows.hasValue() && !this.selectedGroup.guests;
    }
}
