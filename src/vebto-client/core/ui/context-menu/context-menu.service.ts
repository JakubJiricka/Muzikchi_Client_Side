import {ComponentFactoryResolver, ComponentRef, Injectable, Injector, NgZone, Type, ElementRef} from '@angular/core';
import {NavigationStart, Router} from "@angular/router";
import {ComponentPortal} from "@angular/cdk/portal";
import {Overlay, OverlayRef, PositionStrategy} from "@angular/cdk/overlay";
import {filter} from "rxjs/operators";
import {UiModule} from '../ui.module';

export interface ContextMenuParams {
    data?: {[key: string]: any},
    offsetX?: number,
    offsetY?: number,
    originX?: 'start' | 'center' | 'end',
    originY?: 'top' | 'center' | 'bottom';
    overlayX?: 'start' | 'center' | 'end',
    overlayY?: 'top' | 'center' | 'bottom',
}

type MenuOrigin = MouseEvent|EventTarget|HTMLElement;

const ORIGIN_ID = 'dynamic-context-menu-origin';

@Injectable({
    providedIn: UiModule
})
export class ContextMenu {

    private overlayRef: OverlayRef;

    private lastOrigin: HTMLElement;

    /**
     * ModalService constructor.
     */
    constructor(
        private router: Router,
        private zone: NgZone,
        private injector: Injector,
        private resolver: ComponentFactoryResolver,
        private overlay: Overlay,
    ) {
        this.router.events
            .pipe(filter(e => e instanceof NavigationStart))
            .subscribe(() => this.close());
    }

    /**
     * Show specified modal.
     */
    public open<T>(component: Type<T>, e: MenuOrigin, params: ContextMenuParams): ComponentRef<T> {
        this.close();

        const componentRef = this.createOverlay(e, params).attach(new ComponentPortal(component));
        componentRef.instance['data'] = params.data || {};

        return componentRef;
    }

    /**
     * Close currently open context menu.
     */
    public close() {
        this.removeLastOrigin();

        if (this.overlayRef) {
            this.overlayRef.dispose();
            this.overlayRef = null;
        }
    }

    private createOverlay(e: MenuOrigin, params: ContextMenuParams) {
        this.overlayRef = this.overlay.create({
            positionStrategy: this.getMenuPositionStrategy(e, params),
            scrollStrategy: this.overlay.scrollStrategies.close(),
            hasBackdrop: true,
            backdropClass: 'context-menu-backdrop',
            panelClass: 'context-menu-overlay'
        });

        this.overlayRef.backdropClick().subscribe(() => {
            this.close();
        });

        this.overlayRef.attachments().subscribe(() => {
            this.overlayRef.backdropElement.addEventListener('contextmenu', e => {
                e.preventDefault();
                this.close();
            });
        });

        this.overlayRef.detachments().subscribe(() => {
            this.close();
        });

        return this.overlayRef;
    }

    private getMenuPositionStrategy(e: MenuOrigin, params: ContextMenuParams): PositionStrategy {
        this.createOriginFromEvent(e, params);

        const primary = {
            originX: params.originX || 'end',
            originY: params.originY || 'bottom',
            overlayX: params.overlayX || 'start',
            overlayY: params.overlayY || 'top',
        };

        return this.overlay.position().flexibleConnectedTo(new ElementRef(this.lastOrigin))
            .withPositions([
                primary,
                {originX: 'end', originY: 'bottom', overlayX: 'start', overlayY: 'bottom'},
                {originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top'},
                {originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'bottom'}
            ]);
    }

    private createOriginFromEvent(e: MenuOrigin, params: ContextMenuParams) {
        if (e instanceof HTMLElement || e instanceof EventTarget) {
            this.lastOrigin = e as HTMLElement;
        } else {
            this.lastOrigin = document.createElement('div');
            this.lastOrigin.style.position = 'fixed';
            this.lastOrigin.style.top = e.clientY + (params.offsetY || 0) + 'px';
            this.lastOrigin.style.left = e.clientX + (params.offsetX || 0) +'px';
            this.lastOrigin.id = ORIGIN_ID;
            document.body.appendChild(this.lastOrigin);
        }
    }

    private removeLastOrigin() {
        if (this.lastOrigin && this.lastOrigin.id === ORIGIN_ID) {
            this.lastOrigin.remove();
        }
    }
}
