export const BEMUSIC_CONFIG = {
    assetsPrefix: 'client',
    navbar: {
        defaultPosition: 'dashboard',
        dropdownItems: [
            {route: '/popular-genres', name: 'Player', icon: 'audiotrack'},
        ]
    },
    auth: {
      redirectUri: '/',
      adminRedirectUri: '/',
    },
    accountSettings: {
        hideNavbar: true,
    },
    customPages: {
        hideNavbar: true,
    },
    admin: {
        hideBilling: true,
        pages: [
            {name: 'artists', icon: 'mic', route: 'artists', permission: 'artists.view'},
            {name: 'albums', icon: 'album', route: 'albums', permission: 'albums.view'},
            {name: 'tracks', icon: 'audiotrack', route: 'tracks', permission: 'tracks.view'},
            {name: 'lyrics', icon: 'queue-music', route: 'lyrics', permission: 'lyrics.view'},
            {name: 'playlists', icon: 'playlist-play', route: 'playlists', permission: 'playlists.view'},
        ],
        settingsPages: [
            {name: 'providers', route: 'providers'},
            {name: 'player', route: 'player'},
            {name: 'genres', route: 'genres'},
            {name: 'blocked artists', route: 'blocked-artists'},
        ],
        analytics: {
          stats: [
              {name: 'users', icon: 'people'},
              {name: 'tracks', display_name: 'songs', icon: 'audiotrack'},
              {name: 'artists', icon: 'mic'},
              {name: 'albums', icon: 'album'},
          ]
        },
        ads: [
            {name: 'Slot #1', slot: 'ad_slot_1', description: 'This ad will appear at the top of most pages. Best size <= 150px height or responsive.'},
            {name: 'Slot #2', slot: 'ad_slot_2', description: 'This ad will appear at the bottom of most pages. Best size <= 150px height or responsive.'},
            {name: 'Slot #3', slot: 'ad_slot_3', description: 'This ad will appear in artist page only (below popular songs). Best size <= 1000px width or responsive.'},
            {name: 'Slot #4', slot: 'ad_slot_4', description: 'This ad will appear in artist page only (below similar artists). Best size <= 430px width or responsive.'},
            {name: 'Slot #5', slot: 'ad_slot_5', description: 'This ad will appear in album page only (above album tracks). Best size is as wide as possible or responsive.'},
        ],
        appearance: {
            defaultRoute: 'popular-genres',
            navigationRoutes: [
                'popular-genres',
                'new-releases',
                'top-50',
                'popular-albums',
                'artist',
                'album',
                'track',
                'playlist',
                'genre',
                'user',
                'account',
                'login',
                'register',
            ],
            menus: {
                availableRoutes:  [
                    'popular-genres',
                    'new-releases',
                    'top-50',
                    'popular-albums',
                ],
                positions: [
                    'sidebar-primary',
                    'sidebar-secondary',
                    'mobile-bottom'
                ]
            },
        }
    },
};