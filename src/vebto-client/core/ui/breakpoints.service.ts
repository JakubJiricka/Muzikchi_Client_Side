import {Injectable} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';

@Injectable()
export class BreakpointsService {

    public isMobile: boolean = false;

    constructor(private breakpointObserver: BreakpointObserver) {
        this.breakpointObserver.observe(Breakpoints.Handset).subscribe(result => {
            this.isMobile = result.matches;
        });
    }

    public observe(value: string) {
        return this.breakpointObserver.observe(value);
    }
}
