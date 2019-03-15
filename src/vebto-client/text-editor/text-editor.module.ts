import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ColorPickerModule} from "ngx-color-picker";
import {
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule, MatMenuModule, MatPaginatorModule, MatSnackBarModule, MatSortModule, MatTableModule,
    MatTooltipModule
} from "@angular/material";
import {TextEditorComponent} from "./text-editor.component";
import {CoreModule} from "../core/core.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CoreModule,
        ColorPickerModule,

        //material
        MatButtonModule,
        MatSnackBarModule,
        MatTableModule,
        MatCheckboxModule,
        MatPaginatorModule,
        MatSortModule,
        MatTooltipModule,
        MatDialogModule,
        MatMenuModule,
    ],
    declarations: [
        TextEditorComponent,
    ],
    exports: [
        TextEditorComponent,
    ],
    providers: [
        ColorPickerModule,
    ]
})
export class TextEditorModule { }