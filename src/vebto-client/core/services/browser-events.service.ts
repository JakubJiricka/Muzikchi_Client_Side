import {Injectable} from '@angular/core';
import {Observable, fromEvent} from "rxjs";
import {filter} from "rxjs/operators";
import {CoreModule} from '../core.module';

@Injectable({
    providedIn: CoreModule,
})
export class BrowserEvents {

    /**
     * Keyboard key codes map.
     */
    public readonly keyCodes = {
        enter: 13,
        space: 32,
        escape: 27,
        delete: 46,
        arrowUp: 38,
        arrowRight: 39,
        arrowDown: 40,
        arrowLeft: 37,
        letters: {
            s: 83,
            n: 78,
            a: 65,
            t: 84,
            b: 66,
            c: 67,
            o: 79,
            p: 80,
            r: 82,
            f: 70,
        },
    };

    /**
     * Click event for every element inside app component.
     */
    public globalClick$: Observable<MouseEvent>;

    /**
     * Browser KeyDown event.
     */
    public globalKeyDown$: Observable<KeyboardEvent>;

    /**
     * Create observables for document events.
     */
    public subscribeToEvents(el) {
        //document click event
        this.globalClick$ = fromEvent(el, 'click');

        //document keyDown event
        this.globalKeyDown$ = fromEvent(document, 'keydown')
            .pipe(filter(() => !BrowserEvents.userIsTyping())) as Observable<KeyboardEvent>;
    }

    /**
     * Check if an input or textarea element is currently focused.
     */
    public static userIsTyping() {
        const inputs = ['input', 'textarea'],
              tagName = document.activeElement.tagName;

        if ( ! tagName) return true;

        return inputs.indexOf(tagName.toLowerCase()) > -1;
    }
}