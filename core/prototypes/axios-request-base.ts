import { Axios, AxiosRequestConfig } from "axios";
import { Storage } from "../components/storage";
import _ from "lodash";

/**
 * Base class for classes implementing different requests over axios.
 */
export abstract class AxiosRequestBase {
    public constructor(protected readonly $axios: Axios) {}

    /**
     * Adds prefix to request url
     * @param url
     * @returns
     */
    protected abstract prepareUrl(url: string): string;

    /**
     * Adds necessary data to requests
     * @param config
     */
    protected prepareConfig(config?: AxiosRequestConfig): AxiosRequestConfig {
        let updated_config: AxiosRequestConfig = {};
        if (config) {
            updated_config = _.cloneDeep(config);
        }
        const access_token = Storage.getJwtAuthorizationToken();
        if (access_token) {
            updated_config.headers = _.assign({}, updated_config.headers, {
                Authorization: `Bearer ${access_token}`,
            });
        }

        return updated_config;
    }
}
