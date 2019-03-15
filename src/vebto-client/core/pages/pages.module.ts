import {NgModule} from '@angular/core';
import {RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {CustomPageComponent} from "./custom-page/custom-page.component";
import {NotFoundPageComponent} from './not-found-page/not-found-page.component';
import {CustomHomepage} from './custom-homepage.service';
import {Pages} from './pages.service';
import {UiModule} from '../ui/ui.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        UiModule,
    ],
    declarations: [
        CustomPageComponent,
        NotFoundPageComponent,
    ],
    exports: [

    ],
    providers: [
        CustomHomepage,
        Pages,
    ],
    entryComponents: [
        CustomPageComponent,
    ]
})
export class PagesModule {
}

