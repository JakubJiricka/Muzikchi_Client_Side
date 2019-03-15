import {Album} from "./Album";
import {Playlist} from "./Playlist";
import {Lyric} from "./Lyric";
import {User} from "vebto-client/core/types/models/User";

export class Track {
	id: number;
	name: string;
	album_name: string;
	number: number;
	duration?: number;
	artists?: string[];
	youtube_id?: string;
	spotify_popularity: number;
	album_id: number;
	temp_id?: string;
	track_image: string;
	url?: string;
	users?: User[];
	lyric?: Lyric;
	plays: number = 0;
	album?: Album;
	playlists?: Playlist[];
    score:  number  ;
    score_high: number ;
    score_high_track_id: number  ;
    score_high_user_id: number ;
    user_id: number;

	constructor(params: Object = {}) {
        for (let name in params) {
            this[name] = params[name];
        }
    }
}
