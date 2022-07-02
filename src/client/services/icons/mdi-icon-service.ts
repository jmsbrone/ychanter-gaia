import { IconServiceInterface } from "client/prototypes/icon-service-interface";

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
        settings: "cog",
        save: "content-save",
        photo: "camera",
        add_image: "camera-plus",
        "delete-sweep": "delete-sweep",
        section_tree: "file-tree",
        content: "format-list-text",
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
    };
    private missing_icon = "alert-octagram";

    public getIcon(name: string): string {
        let icon_name = this.icon_map[name];
        if (!icon_name) {
            icon_name = this.missing_icon;
        }
        return `mdi-${icon_name}`;
    }
}
