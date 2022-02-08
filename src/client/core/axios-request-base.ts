import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { AxiosRequestConfig } from "@nuxtjs/axios/node_modules/axios";
import _ from "client/helpers/lodash";
import { ClientStorage } from "client/core/components/storage/client-storage";

/**
 * Base class for classes implementing different requests over axios.
 */
export abstract class AxiosRequestBase {
    public constructor(protected readonly $axios: NuxtAxiosInstance) {}

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
        const access_token = ClientStorage.getInstance().getJwtAuthorizationToken();
        if (access_token) {
            updated_config.headers = _.assign({}, updated_config.headers, {
                Authorization: `Bearer ${access_token}`,
            });
        }

        return updated_config;
    }
}
