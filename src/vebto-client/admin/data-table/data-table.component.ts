import {
    AfterContentInit,
    Component,
    ContentChildren, Input,
    OnInit,
    QueryList,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {MatColumnDef, MatPaginator, MatTable,} from '@angular/material';
import {PaginatedDataTableSource} from './data/paginated-data-table-source';

@Component({
    selector: 'data-table',
    templateUrl: './data-table.component.html',
    styleUrls: ['./data-table.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DataTableComponent<T> implements OnInit, AfterContentInit {

    /**
     * Instance of material table.
     */
    @ViewChild(MatTable) table: MatTable<T>;

    /**
     * Column definitions provided via ng-content.
     */
    @ContentChildren(MatColumnDef) columnDefs: QueryList<MatColumnDef>;

    /**
     * Instance of material paginator component.
     */
    @ViewChild(MatPaginator) matPaginator: MatPaginator;

    /**
     * Data table source provided by user.
     */
    @Input() public dataSource: PaginatedDataTableSource<T>;

    /**
     * Display name for items inside the data table.
     */
    @Input() public itemsName: string;

    /**
     * Columns that should be displayed in data table.
     */
    public columns: string[] = ['select'];

    ngOnInit() {
        this.dataSource.config.matPaginator = this.matPaginator;
        this.dataSource.config.matSort.start = 'desc';
        if ( ! this.dataSource.config.delayInit) this.dataSource.init();
    }

    ngAfterContentInit() {
        // Register the normal column defs to the table
        this.columnDefs.forEach(columnDef => {
            this.columns.push(columnDef.name);
            this.table.addColumnDef(columnDef);
        });
    }
}
