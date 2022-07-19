import { IconServiceInterface } from "../../spi/icon-service-interface";

export class MdIconService implements IconServiceInterface {
    private icon_map = {
        delete: "delete",
        undo: "undo",
        redo: "redo",
        close: "close",
        add: "add",
        edit: "edit",
        back: "arrow_back",
        settings: "settings",
        save: "save",
        webpage_tree: "account_tree",
        content: "apps",
        home: "home",
        photo: "photo",
        folder: "folder",
        images: "folder-multiple-image",
        dashboard: "view-dashboard",
        "dots-vertical": "more_vert",
        "web-page": "web",
        "notification-error": "error",
        "notification-success": "check_circle",
        "notification-info": "info",
        "web-page-designer": "dashboard_customize",
        gallery: "photo_library",
        playlist: "library_music",
        play_track: "play_circle",
        pause_track: "pause_circle",
        playlist_track: "audiotrack",
        player_play: "play_arrow",
        player_pause: "pause",
        player_next: "skip_next",
        player_previous: "skip_previous",
        open_web_page: "open_in_new",
    };
    private missing_icon = "report_problem";

    public getIcon(name: string): string {
        let icon_name = this.icon_map[name];
        if (!icon_name) {
            icon_name = this.missing_icon;
        }
        return icon_name;
    }
}
