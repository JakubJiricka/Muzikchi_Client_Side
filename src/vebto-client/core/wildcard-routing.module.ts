import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {NotFoundPageComponent} from "./pages/not-found-page/not-found-page.component";
import {UiModule} from './ui/ui.module';

const routes: Routes = [
    // {
    //     path: '**',
    //     pathMatch: 'full',
    //     component: NotFoundPageComponent
    // },
    // {
    //     path: '404',
    //     pathMatch: 'full',
    //     component: NotFoundPageComponent
    // },
];

@NgModule({
    imports: [
        UiModule,
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule],
})
export class WildcardRoutingModule { }