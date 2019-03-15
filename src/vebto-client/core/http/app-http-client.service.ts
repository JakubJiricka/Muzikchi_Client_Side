import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpEventType, HttpParams, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {HttpErrorHandler} from "./errors/http-error-handler.service";
import {catchError, last, map, tap} from "rxjs/operators";
import {HttpModule} from './http.module';

export interface UploadFileEvent<T> {
    type: HttpEventType,
    name: 'upload_started'|'upload_progress'|'upload_completed'|'other',
    progress?: number,
    body?: T | null,
}

@Injectable({
    providedIn: HttpModule
})
export class AppHttpClient {

    static prefix = 'secure';

    /**
     * AppHttpClient Constructor.
     */
    constructor(protected httpClient: HttpClient, protected errorHandler: HttpErrorHandler) {}

    public get<T>(uri: string, params = {}): Observable<T>|any {
        console.log("::::"+this.prefixUri(uri));
        const httpParams = this.generateHttpParams(params);
        return this.httpClient.get<T>(this.prefixUri(uri), {params: httpParams}).pipe(catchError(err => this.errorHandler.handle(err, uri)));
    }

    public post<T>(uri: string, params: object = null): Observable<T>|any {
        return this.httpClient.post<T>(this.prefixUri(uri), params).pipe(catchError(err => this.errorHandler.handle(err, uri)));
    }

    public put<T>(uri: string, params: object = {}): Observable<T>|any {
        params = this.spoofHttpMethod(params, 'PUT');
        return this.httpClient.post<T>(this.prefixUri(uri), params).pipe(catchError(err => this.errorHandler.handle(err, uri)));
    }

    public delete<T>(uri: string, params: object = {}): Observable<T>|any {
        params = this.spoofHttpMethod(params, 'DELETE');
        return this.httpClient.post<T>(this.prefixUri(uri), params).pipe(catchError(err => this.errorHandler.handle(err, uri)));
    }

    public postWithProgress<T>(uri: string, params: object = {}): Observable<UploadFileEvent<T>> {
        const req = new HttpRequest('POST', this.prefixUri(uri), params, {
            reportProgress: true
        });

        return this.httpClient.request(req).pipe(
            map(event => this.getEventMessage<T>(event)),
            catchError(err => this.errorHandler.handle(err, uri))
        );
    }

    private getEventMessage<T>(event: HttpEvent<any>): UploadFileEvent<T> {
        switch (event.type) {
            case HttpEventType.Sent:
                return {type: event.type, name: 'upload_started'};
            case HttpEventType.UploadProgress:
                return {
                    type: event.type,
                    name: 'upload_progress',
                    progress: Math.round(100 * event.loaded / event.total)
                };
            case HttpEventType.Response:
                return {type: event.type, name: 'upload_completed', body: event.body};
            default:
                return {type: event.type, name: 'other'};
        }
    }

    /**
     * Prefix specified uri with backend API prefix.
     */
    private prefixUri(uri: string) {
        if (uri.indexOf('://') > -1) return uri;
        return AppHttpClient.prefix+'/'+uri
    }

    /**
     * Generate http params for GET request.
     */
    private generateHttpParams(params: object) {
        let httpParams = new HttpParams();

        for(let key in params) {
            httpParams = httpParams.append(key, params[key]);
        }

        return httpParams;
    }

    /**
     * Spoof http method by adding "_method" to request params.
     */
    private spoofHttpMethod(params: object|FormData, method: 'PUT'|'DELETE'): object|FormData {
        if (params instanceof FormData) {
            (params as FormData).append('_method', method);
        } else {
            params['_method'] = method;
        }

        return params;
    }
}
