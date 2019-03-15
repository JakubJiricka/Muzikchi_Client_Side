import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {SelectPermissionsModalComponent} from "../../permissions/select-permissions-modal/select-permissions-modal.component";
import {SelectGroupsModalComponent} from "../select-groups-modal/select-groups-modal.component";
import {User} from "../../../core/types/models/User";
import {Group} from "../../../core/types/models/Group";
import {Users} from "../../../auth/users.service";
import {GroupService} from "../../groups/group.service";
import {Modal} from "../../../core/ui/modal.service";

@Component({
    selector: 'user-access-manager',
    templateUrl: './user-access-manager.component.html',
    styleUrls: ['./user-access-manager.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class UserAccessManagerComponent implements OnInit  {

    /**
     * User that's being edited.
     */
    @Input() public user = new User();

    /**
     * Whether user access manager should be readonly
     * or allow adding/removing groups and permissions.
     */
    @Input() public readonly = false;

    /**
     * All existing groups.
     */
    public allGroups: Group[];

    /**
     * UserAccessManagerComponent Constructor.
     */
    constructor(
        public userService: Users,
        private groupService: GroupService,
        private modal: Modal,
    ) {}

    /**
     * Called after data-bound properties of a directive are initialized.
     */
    public ngOnInit() {
        this.fetchAllGroups();
    }

    /**
     * Open select groups modal.
     */
    public openSelectGroupsModal() {
        let selected = this.user.groups.map(group => group.id);

        this.modal.open(
            SelectGroupsModalComponent,
            {selected},
            'select-groups-modal-container'
        ).afterClosed().subscribe(groups => {
            if ( ! groups) return;
            this.attachGroups(groups);
        });
    }

    /**
     * Attach specified groups to user.
     */
    public async attachGroups(groups: number[]) {
        if (this.user.id) {
            await this.userService.attachGroups(this.user.id, {groups}).toPromise().catch(() => {});
        }

        groups.forEach(id => {
            let group = this.allGroups.find(group => group.id == id);
            if (group) this.user.groups.push(group);
        });
    }

    /**
     * Detach specified groups from user.
     */
    public async detachGroups(groups: number[]) {
        if (this.user.id) {
            await this.userService.detachGroups(this.user.id, {groups}).toPromise().catch(() => {});
        }

        this.user.groups = this.user.groups.filter(group => groups.indexOf(group.id) === -1);
    }

    /**
     * Open Selected permissions modal.
     */
    public openSelectPermissionsModal() {
        this.modal.open(SelectPermissionsModalComponent, null, 'select-permissions-modal-container')
            .afterClosed()
            .subscribe(permissions => {
                if ( ! permissions) return;
                this.addPermissions(permissions);
            });
    }

    /**
     * Add specified permissions to user.
     */
    public async addPermissions(permissions: string[]) {
        if (this.user.id) {
            await this.userService.addPermissions(this.user.id, {permissions}).toPromise().catch(() => {});
        }

        let newPermissions = {};
        permissions.forEach(permission => {
            newPermissions[permission] = 1;
        });

        this.user.permissions = Object.assign({}, this.user.permissions, newPermissions);
    }

    /**
     * Remove specified permissions from user.
     */
    public async removePermissions(permissions: string[]) {
        if (this.user.id) {
            await this.userService.removePermissions(this.user.id, {permissions}).toPromise().catch(() => {});
        }

        let newPermissions = {};
        for (let name in this.user.permissions as any) {
            if (permissions.indexOf(name) === -1) {
                newPermissions[name] = 1;
            }
        }

        this.user.permissions = newPermissions as any;
    }

    /**
     * Fetch all available groups, if component is not in readonly mode.
     */
    private fetchAllGroups() {
        if (this.readonly) return;

        this.groupService.getGroups()
            .subscribe(response => this.allGroups = response.data);
    }
}
