/**
 * @summary
 *
 * Constants used on both client and server sides
 */

export const API_URL_PATH = "/api";

export const API_FILE = "file";
export const API_AUTH = "auth";

export const LOGIN_FIELD = "login";
export const PASSWORD_FIELD = "password";

export const JWT_TOKEN_SSR_ID = "jwt-token";
export const JWT_TOKEN_COOKIE = "access_token";
export const JWT_REFRESH_TOKEN_HEADER = "jwt-refresh-token";

export const GRAPHQL_PATH = "";

export const enum Settings {
    REUSE_FILES_ON_DUPLICATE_UPLOAD = "reuse-file-on-duplicate-upload",
    STORE_FILES_IN_DB = "store-files-in-db",
}

export const enum MODULE_ID {
    AUTH,
    SYSVAR,
    FILE,
    NUXT,
    DYNAMIC_ENTITY,
    SECTION,
}

export const ERROR_MESSAGE_TEMPLATE_VAR_BOUNDARY = "%%";
