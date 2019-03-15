import {Component, Inject, Optional, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

export interface LyricsModalData {
    lyrics: string
}

@Component({
    selector: 'lyrics-modal',
    templateUrl: './lyrics-modal.component.html',
    styleUrls: ['./lyrics-modal.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class LyricsModalComponent {

    /**
     * Lyrics text.
     */
    public lyrics: string;

    /**
     * LyricsModalComponent Constructor.
     */
    constructor(
        private dialogRef: MatDialogRef<LyricsModalComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: LyricsModalData,
    ) {
        this.lyrics = data.lyrics;
    }
}