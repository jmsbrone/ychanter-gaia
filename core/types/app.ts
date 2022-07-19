import { PlainObject } from "./basic";

export class ServerSettings {
    file_transfer_limit_bytes: number;
}

export type AppNotification = {
    open: boolean;
    text: string;
    type: "error" | "info" | "success";
};

export type PageComponentProps = {
    name: string;
    designerMode: boolean;
    options?: PlainObject;
};
