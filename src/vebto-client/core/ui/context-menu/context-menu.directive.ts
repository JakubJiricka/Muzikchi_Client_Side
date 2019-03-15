import {Directive, ElementRef, Inject, Input, OnInit} from '@angular/core';
import {ContextMenu} from './context-menu.service';
import {AVAILABLE_CONTEXT_MENUS} from '../ui.module';

@Directive({
    selector: '[contextMenu]'
})
export class ContextMenuDirective implements OnInit {

    /**
     * Params for displaying context menu for specified item.
     */
    @Input('contextMenu') params: string|{type: string, [key: string]: any};

    public availableMenus: object = {};

    constructor(
        private el: ElementRef,
        private contextMenu: ContextMenu,
        @Inject(AVAILABLE_CONTEXT_MENUS) _availableMenus: object[]
    ) {
        _availableMenus.forEach(config => {
            Object.assign(this.availableMenus, config);
        });
    }

    ngOnInit() {
        this.el.nativeElement.addEventListener('contextmenu', e => {
            e.preventDefault();
            this.contextMenu.open(this.getMenuComponent(), e, {data: this.getMenuData()});
        });
    }

    private getMenuComponent() {
        if (typeof this.params === 'string') {
            return this.availableMenus[this.params];
        } else {
            return this.availableMenus[this.params.type];
        }
    }

    private getMenuData() {
        return (typeof this.params === 'string') ? {type: this.params} : this.params;
    }
}
