import {NgModule} from '@angular/core';
import {MapToIterable} from './map-to-iterable.pipe';

@NgModule({
    declarations: [
        MapToIterable
    ],
    exports: [
        MapToIterable,
    ]
})
export class MapToIterableModule {
}
