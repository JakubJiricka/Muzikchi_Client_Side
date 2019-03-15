import {Injectable} from "@angular/core";
import {Settings} from "../config/settings.service";

@Injectable({
    providedIn: 'root',
})
export class LazyLoaderService {
    private loadedScripts = {};

    constructor(private config: Settings) {}

    /**
     * Load js script and return promise resolved on script load event.
     */
    public loadScript(url, params: { id?: string, force?: boolean } = {}): Promise<any> {
        //script is already loaded, return resolved promise
        if (this.loadedScripts[url] === 'loaded' && !params.force) {
            return new Promise((resolve) => resolve());

            //script has never been loaded before, load it, return promise and resolve on script load event
        } else if (!this.loadedScripts[url]) {
            this.loadedScripts[url] = new Promise((resolve, reject) => {
                let s: HTMLScriptElement = document.createElement('script');
                s.async = true;
                s.id = params.id || url.split('/').pop();
                s.src = url.indexOf('//') > -1 ? url : this.config.getAssetUrl() + url;

                s.onload = () => {
                    this.loadedScripts[url] = 'loaded';
                    resolve();
                };

                document.body.appendChild(s);
            });

            return this.loadedScripts[url];

            //script is still loading, return existing promise
        } else {
            return this.loadedScripts[url];
        }
    }
}