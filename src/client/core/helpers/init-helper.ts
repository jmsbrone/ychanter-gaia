/**
 * This file only serves the purpose of defining the function
 * that is used inside nuxt stores (.js files).
 */
import { JWT_TOKEN_SSR_ID } from "common/constants";
import { PublicAppConfig } from "common/public-app-config";
import { ServerSettings } from "../../types/app";
import { PlainObject } from "../../types/basic";

export function initStoreFromServer(commit: (mutation: string, payload: PlainObject) => void, req: any, res: any) {
    if (req.user) {
        commit("ssr/setData", {
            id: JWT_TOKEN_SSR_ID,
            data: req.user.jwt_refresh_token || req.user.jwt_token,
        });
    }
    if (process.server && res.app_config) {
        const config: PublicAppConfig = res.app_config;
        const data: ServerSettings = {
            file_transfer_limit_bytes: config.files.max_chunk_size,
        };
        commit("settings/setDataFromServer", data);
    }
}
