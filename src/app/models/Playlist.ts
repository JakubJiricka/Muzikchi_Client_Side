import {Track} from "./Track";
import {User} from "vebto-client/core/types/models/User";

export class Playlist {
    id: number;
    name: string;
    public: number;
	image: string;
	description: string;
    created_at: string;
    updated_at: string;
    is_owner: string;
    editors?: User[];
    tracks?: Track[];
    views: number = 0;

    constructor(params: Object = {}) {
        for (let name in params) {
            this[name] = params[name];
        }
    }
}