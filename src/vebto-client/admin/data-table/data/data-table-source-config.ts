import {MatPaginator, MatSort} from "@angular/material";
import {UrlAwarePaginator} from '../../pagination/url-aware-paginator.service';

export interface DataTableSourceConfig<T> {
    uri?: string,
    dataPaginator?: UrlAwarePaginator,
    matPaginator?: MatPaginator,
    matSort?: MatSort,
    delayInit?: boolean
    staticParams?: object,
    initialData?: T[],
}