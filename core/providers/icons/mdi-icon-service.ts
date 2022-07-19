import { IconServiceInterface } from "../../spi/icon-service-interface";

export class MdiIconService implements IconServiceInterface {
    private icon_map = {
        delete: "delete",
        undo: "undo",
        redo: "redo",
        close: "close",
        add: "plus",
        menu: "menu",
        "drop-zone": "elevator-down",
        list: "format-list-text",
        edit: "pencil",
        back: "arrow-left",
        empty: "emoticon-sad",
        open_external: "link-box-variant",
        settings: "settings",
        save: "content-save",
        photo: "camera",
        add_image: "camera-plus",
        "delete-sweep": "delete-sweep",
        webpage_tree: "file-tree",
        content: "view-list",
        users: "account",
        signal: "signal",
        home: "home",
        folder: "folder",
        images: "folder-multiple-image",
        dashboard: "view-dashboard",
        "chevron-right": "chevron-right",
        confirm: "check",
        "dynamic-entity": "home-city",
        "add-audio-file": "music-box",
        play: "play-circle",
        pause: "pause-circle",
        "dots-vertical": "dots-vertical",
        "web-page": "book-open-variant",
        "collapsed-group": "chevron-down",
        "expanded-group": "chevron-up",
        "notification-error": "alert-octagram",
        "notification-success": "check-circle",
        "notification-info": "information-outline",
        "web-page-designer": "tablet-dashboard",
    };
    private missing_icon = "eye-off-outline";

    public getIcon(name: string): string {
        let icon_name = this.icon_map[name];
        if (!icon_name) {
            icon_name = this.missing_icon;
        }
        return `mdi-${icon_name}`;
    }
}
