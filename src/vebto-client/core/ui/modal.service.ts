import {Injectable} from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material";
import {ComponentType} from "@angular/cdk/portal";
import {CoreModule} from '../core.module';

@Injectable({
    providedIn: CoreModule,
})
export class Modal {

    constructor(private dialog: MatDialog) {}

    public open<T>(component: ComponentType<T>, data?: object, className?: string): MatDialogRef<T> {
        return this.dialog.open(component, {panelClass: ['modal', className], data: data});
    }

    public show<T>(component: ComponentType<T>, data?: object): MatDialogRef<T> {
        return this.open(component, data);
    }
}
