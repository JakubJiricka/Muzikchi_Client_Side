import {APP_INITIALIZER, ErrorHandler, ModuleWithProviders, NgModule} from '@angular/core';
import {RouterModule} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from '@angular/common';
import {UiModule} from "./ui/ui.module";
import {Settings} from "./config/settings.service";
import {CurrentUser} from "vebto-client/auth/current-user";
import {Bootstrapper, init_app} from "./bootstrapper.service";
import {ravenErrorHandlerFactory} from "./errors/raven-error-handler";
import {FilesModule} from './files/files.module';
import {HttpErrorHandler} from "./http/errors/http-error-handler.service";
import {BackendHttpErrorHandler} from './http/errors/backend-http-error-handler.service';
import {HttpModule} from './http/http.module';
import {TranslationsModule} from './translations/translations.module';
import {APP_CONFIG, DEFAULT_VEBTO_CONFIG} from './config/vebto-config';
import {DEFAULT_VEBTO_ADMIN_CONFIG} from './config/vebto-admin-config';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        HttpClientModule,
        UiModule,
        FilesModule,
        HttpModule,
        TranslationsModule,
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        HttpClientModule,
        UiModule,
        FilesModule,
        TranslationsModule,
    ],
})
export class CoreModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: CoreModule,
            providers: [
                Bootstrapper,
                {
                    provide: APP_CONFIG,
                    useValue: DEFAULT_VEBTO_CONFIG,
                    multi: true,
                },
                {
                    provide: APP_CONFIG,
                    useValue: DEFAULT_VEBTO_ADMIN_CONFIG,
                    multi: true,
                },
                CurrentUser,
                {
                    provide: HttpErrorHandler,
                    useClass: BackendHttpErrorHandler,
                },
                {
                    provide: APP_INITIALIZER,
                    useFactory: init_app,
                    deps: [Bootstrapper],
                    multi: true,
                },
                {
                    provide: ErrorHandler,
                    useFactory: ravenErrorHandlerFactory,
                    deps: [Settings, CurrentUser],
                },
            ]
        };
    }
}

