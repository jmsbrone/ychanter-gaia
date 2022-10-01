import Cookies from "js-cookie";
import { JWT_TOKEN_COOKIE } from "../constants";
import { PlainObject } from "../types/basic";

export class Storage {
    private static data: PlainObject = {};

    public static put(key: string, data: any) {
        this.data[key] = data;
        localStorage.setItem(key, data);
        if (key === JWT_TOKEN_COOKIE) {
            Cookies.set(JWT_TOKEN_COOKIE, data);
        }
    }

    public static take(key: string): any {
        return this.data[key] ?? localStorage.getItem(key);
    }

    public static getJwtAuthorizationToken(): string {
        let token = this.take(JWT_TOKEN_COOKIE);
        if (!token) {
            token = Cookies.get(JWT_TOKEN_COOKIE);
            if (token) {
                this.put(JWT_TOKEN_COOKIE, token);
            }
        }

        return token;
    }
}
