/**
 * Public application configuration settings that
 * can be shared between server and client.
 */
import { Settings } from "common/constants";

/**
 * Application configuration object
 */
export type PublicAppConfig = {
    prod: boolean;
    debug: boolean;
    testrun: boolean;
    files: {
        max_chunk_size: number;
        [Settings.STORE_FILES_IN_DB]: boolean;
        [Settings.REUSE_FILES_ON_DUPLICATE_UPLOAD]: boolean;
    };
    connection: {
        max_package_size: number;
    };
};
