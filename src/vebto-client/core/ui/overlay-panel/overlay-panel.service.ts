import {ElementRef, Injectable, Injector} from '@angular/core';
import {Overlay, PositionStrategy} from '@angular/cdk/overlay';
import {ComponentPortal, ComponentType, PortalInjector} from '@angular/cdk/portal';
import {BreakpointsService} from '../breakpoints.service';
import {OverlayPanelRef} from './overlay-panel-ref';

export interface PanelConfig {
    position?: 'right' | 'bottom' | 'top' | 'bottom right' | 'bottom left' | 'center',
    positionStrategy?: PositionStrategy,
    origin: ElementRef | 'global',
    hasBackdrop?: boolean,
    closeOnBackdropClick?: boolean,
    panelClass?: string | string[],
}

const DEFAULT_CONFIG = {
    hasBackdrop: true,
    closeOnBackdropClick: true,
    panelClass: 'overlay-panel',
};

@Injectable()
export class OverlayPanel {

    /**
     * OverlayPanel Constructor.
     */
    constructor(
        public overlay: Overlay,
        private breakpoints: BreakpointsService,
        private injector: Injector,
    ) {}

    public open(component: ComponentType<any>, userConfig: PanelConfig) {
        const config = Object.assign({}, DEFAULT_CONFIG, userConfig);

        const overlayRef = this.overlay.create({
            positionStrategy: config.positionStrategy || this.getPositionStrategy(config),
            hasBackdrop: config.hasBackdrop,
            panelClass: config.panelClass,
        });

        const overlayPanelRef = new OverlayPanelRef(overlayRef);

        const portal = new ComponentPortal(component, null, this.createInjector(config, overlayPanelRef));

        const componentRef = overlayRef.attach(portal);

        if (config.closeOnBackdropClick) {
            overlayRef.backdropClick().subscribe(() => overlayPanelRef.close());
        }

        return overlayPanelRef;
    }

    private createInjector(config: PanelConfig, dialogRef: OverlayPanelRef): PortalInjector {
        // Instantiate new WeakMap for our custom injection tokens
        const injectionTokens = new WeakMap();

        // Set custom injection tokens
        injectionTokens.set(OverlayPanelRef, dialogRef);

        // Instantiate new PortalInjector
        return new PortalInjector(this.injector, injectionTokens);
    }

    /**
     * Get position strategy for color picker panel.
     */
    private getPositionStrategy(config: PanelConfig): PositionStrategy {
        if (this.breakpoints.isMobile) {
            return this.overlay.position().global().centerHorizontally().centerVertically();
        } else if (config.origin === 'global') {
            return this.getGlobalPositionStrategy(config);
        } else if (config.position === 'bottom') {
            return this.getBottomPositionStrategy(config);
        } else if (config.position === 'bottom right') {
            return this.getBottomRightPositionStrategy(config);
        } else if (config.position === 'bottom left') {
            return this.getBottomLeftPositionStrategy(config);
        } else if (config.position === 'top') {
            return this.getTopPositionStrategy(config);
        } else {
            return this.getRightPositionStrategy(config);
        }
    }

    private getGlobalPositionStrategy(config: PanelConfig): PositionStrategy {
        if (config.position === 'bottom left') {
            return this.overlay.position().global().left('10px').bottom('10px');
        } else if (config.position === 'center') {
            return this.overlay.position().global().centerHorizontally().centerVertically();
        } else {
            return this.overlay.position().global().right('10px').bottom('10px');
        }
    }

    /**
     * Position overlay panel on the right of origin.
     */
    private getRightPositionStrategy(config: PanelConfig): PositionStrategy {
        return this.overlay.position().connectedTo(
            config.origin as ElementRef,
            {originX: 'end', originY: 'center'},
            {overlayX: 'start', overlayY: 'center'}
        ).withFallbackPosition(
            {originX: 'end', originY: 'center'},
            {overlayX: 'start', overlayY: 'top'}
        ).withOffsetX(35);
    }

    /**
     * Position overlay panel at the bottom of origin with top fallback.
     */
    private getBottomPositionStrategy(config: PanelConfig): PositionStrategy {
        return this.overlay.position().flexibleConnectedTo(config.origin as ElementRef)
            .withPositions([
                {originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: 5},
                {originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom'},
            ]);
    }

    /**
     * Position overlay panel at the bottom right of origin with top fallback.
     */
    private getBottomRightPositionStrategy(config: PanelConfig): PositionStrategy {
        return this.overlay.position().connectedTo(
            config.origin as ElementRef,
            {originX: 'end', originY: 'bottom'},
            {overlayX: 'end', overlayY: 'bottom'}
        ).withOffsetY(-10).withOffsetX(-10);
    }

    /**
     * Position overlay panel at the bottom left of origin with top fallback.
     */
    private getBottomLeftPositionStrategy(config: PanelConfig): PositionStrategy {
        return this.overlay.position().connectedTo(
            config.origin as ElementRef,
            {originX: 'start', originY: 'bottom'},
            {overlayX: 'start', overlayY: 'top'}
        ).withOffsetY(10).withOffsetX(10)
            .withFallbackPosition(
                {originX: 'end', originY: 'top'},
                {overlayX: 'end', overlayY: 'bottom'}
            ).withOffsetY(10).withOffsetX(10);
    }

    /**
     * Position overlay panel at the top of origin with bottom fallback.
     */
    private getTopPositionStrategy(config: PanelConfig): PositionStrategy {
        return this.overlay.position().connectedTo(
            config.origin as ElementRef,
            {originX: 'center', originY: 'top'},
            {overlayX: 'center', overlayY: 'bottom'}
        ).withFallbackPosition(
            {originX: 'center', originY: 'bottom'},
            {overlayX: 'end', overlayY: 'top'}
        ).withOffsetY(-15);
    }
}