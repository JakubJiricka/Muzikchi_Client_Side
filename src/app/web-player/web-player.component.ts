import {Component, OnDestroy, OnInit, Renderer2, ViewEncapsulation} from '@angular/core';
import {SearchSlideoutPanel} from "./search/search-slideout-panel/search-slideout-panel.service";
import {Player} from "./player/player.service";
import {WebPlayerState} from "./web-player-state.service";
import {FullscreenOverlay} from "./fullscreen-overlay/fullscreen-overlay.service";
import {Track} from "../models/Track";
import {Settings} from "vebto-client/core/config/settings.service";
import {WebPlayerImagesService} from "./web-player-images.service";
import {OverlayContainer} from '@angular/cdk/overlay';

@Component({
    selector: 'web-player',
    templateUrl: './web-player.component.html',
    styleUrls: ['./web-player.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: {'id': 'web-player'}
})
export class WebPlayerComponent implements OnInit, OnDestroy {

    /**
     * Whether small video should be hidden.
     */
    public shouldHideVideo = false;

    /**
     * WebPlayerComponent Constructor.
     */
    constructor(
        public searchPanel: SearchSlideoutPanel,
        public player: Player,
        private renderer: Renderer2,
        public state: WebPlayerState,
        private overlay: FullscreenOverlay,
        private settings: Settings,
        private wpImages: WebPlayerImagesService,
        private overlayContainer: OverlayContainer,
    ) {}

    ngOnInit() {
        this.player.init();
        this.overlay.init();
        this.shouldHideVideo = this.settings.get('player.hide_video');
        this.overlayContainer.getContainerElement().classList.add('web-player-theme');
    }

    ngOnDestroy() {
        this.player.destroy();
        this.overlay.destroy();
        this.overlayContainer.getContainerElement().classList.remove('web-player-theme');
    }
}
