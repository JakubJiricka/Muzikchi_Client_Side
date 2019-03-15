import {Injectable} from '@angular/core';

@Injectable()
export class FormattedDuration {

    public fromSeconds(seconds: number) {
        if ( ! seconds) return;

        let date = new Date(null);
        date.setSeconds(seconds);
        return date.toISOString().substr(15, 4);
    }

    public fromMilliseconds(ms: number) {
        if ( ! ms) return;

        let date = new Date(null);
        date.setMilliseconds(ms);

        let string = date.toISOString();

        //remove date part from string
        string = string.replace('Z', '').split('T')[1];

        //0 - hours, 1 - minutes, 2 - seconds
        const parts = string.split(':');

        //05 minutes to 5 minutes
        if (parts[0][0] == '0') parts[0] = parts[0][1];
        if (parts[1][0] == '0') parts[1] = parts[1][1];

        //get rid of milliseconds
        parts[2] = parts[2].split('.')[0];

        //get rid of 00 hours
        if (parts[0] == '00' || parts[0] === '0') parts.splice(0, 1);

        return parts.join(':');
    }

    public toVerboseString(ms: number): string {
        let date = new Date(ms);
        let str = '';

        const hours = date.getUTCHours();
        if (hours) str += hours + "hr ";

        const minutes = date.getUTCMinutes();
        if (minutes) str += minutes + "min ";

        const seconds = date.getUTCMinutes();
        if (seconds && !hours && !minutes) str += seconds + "sec ";

        return str;
    }
}
