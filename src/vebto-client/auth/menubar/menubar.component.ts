import {Component, ViewEncapsulation} from '@angular/core';
import {Player} from "../../../app/web-player/player/player.service";
import {FullscreenOverlay} from "../../../app/web-player/fullscreen-overlay/fullscreen-overlay.service";

@Component({
    selector: 'menubar',
    templateUrl: './menubar.component.html',
    styleUrls: ['./menubar.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class MenubarComponent {

    constructor(public player: Player, public overlay: FullscreenOverlay) {
    }
}
