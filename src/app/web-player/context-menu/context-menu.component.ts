import {ElementRef, Injector, Renderer2} from '@angular/core';
import {Track} from "../../models/Track";
import {Player} from "../player/player.service";
import {UserLibrary} from "../users/user-library/user-library.service";
import {WebPlayerUrls} from "../web-player-urls.service";
import {Toast} from "vebto-client/core/ui/toast.service";
import {Modal} from "vebto-client/core/ui/modal.service";
import * as copyToClipboard from 'copy-to-clipboard';
import {CurrentUser} from "vebto-client/auth/current-user";
import {Router} from "@angular/router";
import {ShareMediaItemModalComponent} from "./share-media-item-modal/share-media-item-modal.component";
import {Settings} from "vebto-client/core/config/settings.service";
import {WebPlayerState} from "../web-player-state.service";
import {WebPlayerImagesService} from "../web-player-images.service";
import {ContextMenu} from 'vebto-client/core/ui/context-menu/context-menu.service';

export abstract class ContextMenuComponent<T> {
    protected player: Player;
    protected library: UserLibrary;
    public urls: WebPlayerUrls;
    protected contextMenu: ContextMenu;
    protected toast: Toast;
    protected modal: Modal;
    protected el: ElementRef;
    public currentUser: CurrentUser;
    protected router: Router;
    public settings: Settings;
    public wpImages: WebPlayerImagesService;
    protected state: WebPlayerState;

    protected activePanel = 'primary';

    public data: {type: string, item: T, [key: string]: any};

    constructor(protected injector: Injector) {
        this.player = this.injector.get(Player);
        this.library = this.injector.get(UserLibrary);
        this.urls = this.injector.get(WebPlayerUrls);
        this.contextMenu = this.injector.get(ContextMenu);
        this.toast = this.injector.get(Toast);
        this.modal = this.injector.get(Modal);
        this.el = this.injector.get(ElementRef);
        this.currentUser = this.injector.get(CurrentUser);
        this.router = this.injector.get(Router);
        this.settings = this.injector.get(Settings);
        this.state = this.injector.get(WebPlayerState);
        this.wpImages = this.injector.get(WebPlayerImagesService);
    }

    /**
     * Get tracks that should be used by context menu.
     */
    public abstract getTracks(): Track[];

    /**
     * Add specified tracks to player queue.
     */
    public addToQueue() {
        this.player.queue.prepend(this.getTracks());
        this.contextMenu.close();
    }

    /**
     * Add specified tracks to user's library.
     */
    public saveToLibrary() {
        this.contextMenu.close();

        if ( ! this.currentUser.isLoggedIn()) {
            return this.router.navigate(['/login']);
        }

        this.library.add(this.getTracks());
        this.toast.open('Saved to library')
    }

    /**
     * Copy fully qualified album url to clipboard.
     */
    public copyLinkToClipboard(method: string, item?: any) {
        let url = this.urls.routerLinkToUrl(this.urls[method](item || this.data.item));
        url = url.replace(/ /g, '+');
        copyToClipboard(url);
        this.contextMenu.close();
        this.toast.open('Copied link to clipboard.');
    }

    /**
     * Open share modal for current item.
     */
    public openShareModal() {
        this.contextMenu.close();

        const data = {mediaItem: this.data.item, type: this.data.type};
        this.modal.open(ShareMediaItemModalComponent, data).afterClosed().subscribe(shared => {
            if ( ! shared) return;
            //send emails
        })
    }

    public openPanel(name: string) {
        this.activePanel = name;
    }

    public activePanelIs(name: string) {
        return this.activePanel === name;
    }
}
