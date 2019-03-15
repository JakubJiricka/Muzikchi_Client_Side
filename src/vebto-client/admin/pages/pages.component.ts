import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {CurrentUser} from "vebto-client/auth/current-user";
import {UrlAwarePaginator} from "../pagination/url-aware-paginator.service";
import {MatSort} from "@angular/material";
import {Page} from "../../core/types/models/Page";
import {Modal} from "../../core/ui/modal.service";
import {ConfirmModalComponent} from "../../core/ui/confirm-modal/confirm-modal.component";
import {Pages} from '../../core/pages/pages.service';
import {PaginatedDataTableSource} from '../data-table/data/paginated-data-table-source';

@Component({
    selector: 'pages',
    templateUrl: './pages.component.html',
    styleUrls: ['./pages.component.scss'],
    providers: [UrlAwarePaginator],
    encapsulation: ViewEncapsulation.None,
})
export class PagesComponent implements OnInit {
    @ViewChild(MatSort) matSort: MatSort;

    public dataSource: PaginatedDataTableSource<Page>;

    /**
     * PagesComponent Constructor.
     */
    constructor(
        public paginator: UrlAwarePaginator,
        private pages: Pages,
        private modal: Modal,
        public currentUser: CurrentUser,
    ) {}

    ngOnInit() {
        this.dataSource = new PaginatedDataTableSource<Page>({
            uri: 'pages',
            dataPaginator: this.paginator,
            matSort: this.matSort
        });
    }

    /**
     * Ask user to confirm deletion of selected pages
     * and delete selected pages if user confirms.
     */
    public maybeDeleteSelectedPages() {
        this.modal.show(ConfirmModalComponent, {
            title: 'Delete Pages',
            body:  'Are you sure you want to delete selected pages?',
            ok:    'Delete'
        }).afterClosed().subscribe(confirmed => {
            if ( ! confirmed) return;
            this.deleteSelectedPages();
        });
    }

    /**
     * Delete currently selected pages.
     */
    public deleteSelectedPages() {
        const ids = this.dataSource.getSelectedItems();

        this.pages.delete(ids).subscribe(() => {
            this.paginator.refresh();
            this.dataSource.deselectAllItems();
        });
    }
}
