import {Injectable} from '@angular/core';
import {Keycodes} from './keycodes.enum';
import {CoreModule} from '../core.module';

type ParsedKeybind = {ctrl: boolean, shift: boolean, key: string};

@Injectable({
    providedIn: CoreModule,
})
export class Keybinds {

    private bindings = [];

    constructor() {
        this.listenOn(document);
    }

    public add(keybind: string, callback: Function) {
        this.bindings.push({keybind: this.parseKeybindString(keybind), keybindString: keybind, callback});
    }

    public addWithPreventDefault(keybind: string, callback: Function) {
        this.bindings.push({keybind: this.parseKeybindString(keybind), keybindString: keybind, callback, preventDefault: true});
    }

    public listenOn(document: Document) {
        document.addEventListener('keydown', (e: KeyboardEvent) => {
            this.executeBindings(e);
        });
    }

    private executeBindings(e: KeyboardEvent) {
        this.bindings.forEach(binding => {
            if ( ! this.bindingMatches(binding.keybind, e)) return;
            if (binding.preventDefault && e.preventDefault) e.preventDefault();
            binding.callback(e);
        });
    }

    private bindingMatches(keybind: ParsedKeybind, e: KeyboardEvent) {
        return Keycodes[keybind.key.toUpperCase()] === e.keyCode && e.ctrlKey === keybind.ctrl && e.shiftKey === keybind.shift;
    }

    /**
     * Parse keybind string into object.
     */
    private parseKeybindString(keybind: string): ParsedKeybind {
        const parts = keybind.trim().split('+');
        const parsed = {ctrl: false, shift: false, key: ''};

        parts.forEach(part => {
            part = part.trim().toLowerCase();

            if (part === 'ctrl') {
                parsed.ctrl = true;
            } else if (part === 'shift') {
                parsed.shift = true;
            } else {
                parsed.key = part;
            }
        });

        return parsed;
    }
}
