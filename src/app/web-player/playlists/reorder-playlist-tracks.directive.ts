import {AfterContentInit, Directive, ElementRef, Input, NgZone} from '@angular/core';
import * as Sortable from "sortablejs";
import {Playlists} from './playlists.service';
import {PlaylistService} from './playlist.service';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';

@Directive({
    selector: '[reorderPlaylistTracks]'
})
export class ReorderPlaylistTracksDirective implements AfterContentInit {

    @Input() public playlist: PlaylistService;

    private isMobile = false;

    /**
     * ReorderPlaylistTracks Constructor.
     */
    constructor(
        private el: ElementRef,
        private playlists: Playlists,
        private zone: NgZone,
        private breakpoints: BreakpointObserver
    ) {
        this.breakpoints.observe(Breakpoints.Handset).subscribe(state => {
            this.isMobile = state.matches;
        });
    }

    ngAfterContentInit() {
        if (this.isMobile) return;

        this.zone.runOutsideAngular(() => {
            new Sortable(this.el.nativeElement, {
                draggable: '.track-list-item',
                animation: 200,
                onUpdate: () => {
                    const items = this.el.nativeElement.querySelectorAll('.track-list-item'),
                        ids = [];

                    for (let i = 0; i < items.length; i++) {
                        ids.push(items[i].dataset.id);
                    }

                    this.reorderTracks(ids);
                }
            });
        })
    }

    /**
     * Reorder playlist tracks using specified order.
     */
    private reorderTracks(tracks: number[]) {
        this.playlists.changeTrackOrder(this.playlist.get().id, tracks).subscribe(() => {
            //
        });
    }
}
