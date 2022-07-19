import Cookies from "js-cookie";
import { PlainObject } from "../types/basic";

export class Storage {
    private static data: PlainObject = {};

    public static put(key: string, data: any) {
        this.data[key] = data;
        if (key === "jwt-auth-token") {
            Cookies.set("jwt-auth-token", data);
        }
    }

    public static take(key: string): any {
        return this.data[key];
    }

    public static getJwtAuthorizationToken(): string {
        let token = this.take("jwt-auth-token");
        if (!token) {
            if (!token) {
                token = Cookies.get("jwt-auth-token");
            }
            this.put("jwt-auth-token", token);
        }

        return token;
    }
}
