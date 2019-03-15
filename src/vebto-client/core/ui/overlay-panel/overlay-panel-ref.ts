import {OverlayRef} from '@angular/cdk/overlay';
import {Observable, Subject} from 'rxjs';

export class OverlayPanelRef {

    private value = new Subject<any>();

    constructor(private overlayRef: OverlayRef) {}

    public isOpen(): boolean {
        return this.overlayRef && this.overlayRef.hasAttached();
    }

    public close() {
        this.overlayRef && this.overlayRef.dispose();
    }

    public emitValue(value: any) {
        this.value.next(value);
    }

    public valueChanged(): Observable<any> {
        return this.value.asObservable();
    }

    public getPanelEl() {
        return this.overlayRef.overlayElement;
    }

    public updatePosition() {
    	return this.overlayRef.updatePosition();
    }
}