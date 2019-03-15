import {HttpErrorResponse} from "@angular/common/http";
import {Observable, throwError} from 'rxjs';
import {Translations} from "../../translations/translations.service";

export abstract class HttpErrorHandler {

    /**
     * HttpErrorHandler Constructor.
     */
    protected constructor(
        protected i18n: Translations,
    ) {}

    /**
     * Handle http request error.
     */
    public handle(response: HttpErrorResponse, uri?: string): Observable<never> {
        let body = this.parseJson(response.error),
            error = {uri, messages: {}, type: 'http', status: response.status, originalError: new Error(response.message)};

        if (response.status === 403 || response.status === 401) {
            this.handle403Error(body);
        }

        //make sure there's always a "messages" object
        if (body) {
            error.messages = body.messages || {};
        }

        return throwError(error);
    }

    /**
     * Redirect user to login page or show toast informing
     * user that he does not have required permissions.
     */
    protected abstract handle403Error(response: object);

    /**
     * Parse JSON without throwing errors.
     */
    protected parseJson(json: string|object): {messages?: object} {
        if (typeof json !== 'string') return json;

        try {
            return JSON.parse(json);
        } catch (e) {
            return {};
        }
    }
}
