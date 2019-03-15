import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AdminModule} from 'vebto-client/admin/admin.module';
import {AppAdminRoutingModule} from './app-admin-routing.module';
import {ArtistsComponent} from './artists/artists.component';
import {NewArtistPageComponent} from './artists/new-artist-page/new-artist-page.component';
import {ArtistAlbumsTableComponent} from './artists/new-artist-page/artist-albums-table/artist-albums-table.component';
import {CrupdateAlbumModalComponent} from './albums/crupdate-album-modal/crupdate-album-modal.component';
import {CrupdateLyricModalComponent} from './lyrics-page/crupdate-lyric-modal/crupdate-lyric-modal.component';
import {NewTrackModalComponent} from './tracks/new-track-modal/new-track-modal.component';
import {TracksPageComponent} from './tracks/tracks-page/tracks-page.component';
import {AlbumsPageComponent} from './albums/albums-page/albums-page.component';
import {LyricsPageComponent} from './lyrics-page/lyrics-page.component';
import {AlbumTracksTableComponent} from './albums/crupdate-album-modal/album-tracks-table/album-tracks-table.component';
import {MatAutocompleteModule, MatChipsModule} from '@angular/material';
import {PlaylistsPageComponent} from './playlists-page/playlists-page.component';
import {ProvidersSettingsComponent} from './settings/providers/providers-settings.component';
import {GenresSettingsComponent} from './settings/genres/genres-settings.component';
import {PlayerSettingsComponent} from './settings/player/player-settings.component';
import {BlockedArtistsSettingsComponent} from './settings/blocked-artists/blocked-artists-settings.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AppAdminRoutingModule,
        AdminModule,

        // material
        MatChipsModule,
        MatAutocompleteModule,
    ],
    declarations: [
        ArtistsComponent,
        NewArtistPageComponent,
        ArtistAlbumsTableComponent,
        CrupdateAlbumModalComponent,
        CrupdateLyricModalComponent,
        NewTrackModalComponent,
        TracksPageComponent,
        AlbumsPageComponent,
        LyricsPageComponent,
        AlbumTracksTableComponent,
        PlaylistsPageComponent,

        //settings
        ProvidersSettingsComponent,
        GenresSettingsComponent,
        PlayerSettingsComponent,
        BlockedArtistsSettingsComponent,
    ],
    entryComponents: [
        CrupdateAlbumModalComponent,
        CrupdateLyricModalComponent,
        NewTrackModalComponent,
    ]
})
export class AppAdminModule {
}
