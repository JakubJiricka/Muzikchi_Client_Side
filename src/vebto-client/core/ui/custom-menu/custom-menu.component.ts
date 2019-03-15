import {Component, HostBinding, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {CurrentUser} from "vebto-client/auth/current-user";
import {Subscription} from "rxjs";
import {Menu} from "./menu";
import {MenuItem} from "./menu-item";
import {Settings} from "../../config/settings.service";
import {snakeCase} from '../../utils/snake-case';
import { Router } from '@angular/router';
import { Tracks } from 'app/web-player/tracks/tracks.service';
import { Track } from 'app/models/Track';

@Component({
    selector: 'custom-menu',
    templateUrl: './custom-menu.component.html',
    styleUrls: ['./custom-menu.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class CustomMenuComponent implements OnInit, OnDestroy {
    @HostBinding('class.hidden') shouldHide: boolean = false;

    /**
     * Position in the app for this menu.
     */
    @Input() position: string;

    /**
     * Menu that should be rendered.
     */
    public menu = new Menu();

    /**
     * Active component subscriptions.
     */
    public subscriptions: Subscription[] = [];

    public classItem =[];

    /**
     * CustomMenuComponent Constructor.
     */
    constructor(
        private settings: Settings,
        private currentUser: CurrentUser,
        private router: Router,
        private trackService: Tracks
    ) {}

    ngOnInit() {
        this.initMenu();

        //re-render if menu setting is changed
        let sub = this.settings.onChange.subscribe(name => {
            if (name === 'menus') this.initMenu();
        });

        this.subscriptions.push(sub);

        this.classItem['new'] = '';
        this.classItem['top__50'] = '';
        this.classItem['search'] = '';
        this.classItem['your__music'] = '';
        this.classItem['account'] = '';
        if(this.settings.menuName == 'your__music') {
            this.classItem['your__music'] = 'active';
        }
        if(this.settings.menuName == 'account') {
            this.classItem['account'] = 'active';
        }
        if(this.settings.menuName == 'new') {
            this.classItem['new'] = 'active';
        }
        if(this.settings.menuName == 'top__50') {
            this.classItem['top__50'] = 'active';
        }
        if(this.settings.menuName == 'search') {
            this.classItem['search'] = 'active';
        }
        //let url = this.router.url;
        //if(url== '/login') {
        //    this.classItem['new'] = '';
        //    this.classItem['top_50'] = '';
        //    this.classItem['search'] = '';
        //    this.classItem['your__music'] = '';
        //    this.classItem['account'] = 'active';
        //}
    }

    /**
     * Convert specified string to snake_case.
     */
    public toSnakeCase(string: string) {
        return snakeCase(string);
    }

    /**
     * Get latest song (last one in tracks table) and goes up (except the ones that it’s artist is illegal).
     */
    public tracks: Track[];
    public audio = new Audio();
    public turn = false;
    public getLatest(): void {
        if(this.turn){
           this.turn = false;
           this.audio.pause();
           return;
        }
        this.trackService.getLatest().subscribe( tracks => {
            this.turn = true;
            this.tracks = tracks;
            this.classItem['new'] = '';
            this.classItem['top__50'] = '';
            this.classItem['search'] = '';
            this.classItem['your__music'] = '';
            this.classItem['account'] = '';
            this.classItem['radio'] = 'active';
            let k = 0;
            this.audio.src = this.tracks[k].url;
            this.audio.load();
            this.audio.play();
            let vm = this;
            this.audio.addEventListener("ended", function(){
                if(k === 100)   k = 0;
                else k++;
                vm.audio.src = tracks[k].url;
                vm.audio.load();
                vm.audio.play();
            });
        });
    }

    /**
     * Check if menu item should be displayed.
     */
    public shouldShow(item: MenuItem): boolean {
        if ( ! item) return false;

        switch (item.condition) {
            case 'auth':
                return this.currentUser.isLoggedIn();
            case 'guest':
                return !this.currentUser.isLoggedIn();
            case 'admin':
                return this.currentUser.hasPermission('admin');
            case  'agent':
                return this.currentUser.hasPermission('tickets.update');
            default:
                return true;
        }
    }

    /**
     * Initiate custom menu.
     */
    private initMenu() {
        let json = this.settings.get('menus');

        //get stored custom menus
        let menus = JSON.parse(json);
        if ( ! menus) return this.shouldHide = true;

        //find first menu for specified position
        let menuConfig = menus.find(menu => menu.position === this.position);
        if ( ! menuConfig) return this.shouldHide = true;

        this.menu = new Menu(menuConfig);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => {
            subscription && subscription.unsubscribe();
        });
    }

    public getClass(label:string){
        let url = this.router.url;
        this.audio.pause();
        this.settings.menuName = label;
        if(url== '/login') {
            if(label == 'your__music') {
                this.classItem['new'] = '';
                this.classItem['top__50'] = '';
                this.classItem['search'] = '';
                this.classItem['your__music'] = 'active';
                this.classItem['account'] = '';
                this.classItem['radio'] = '';
            }
            if(label == 'account') {
                this.classItem['new'] = '';
                this.classItem['top__50'] = '';
                this.classItem['search'] = '';
                this.classItem['your__music'] = '';
                this.classItem['radio'] = '';
                this.classItem['account'] = 'active';
            }

        }
    }

}
