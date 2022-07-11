import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { AxiosRequestConfig, AxiosResponse } from "@nuxtjs/axios/node_modules/axios";
import { AxiosRequestBase } from "client/core/prototypes/axios-request-base";

export class AxiosRequest extends AxiosRequestBase {
    public constructor(protected readonly $axios: NuxtAxiosInstance, protected readonly prefix: string = "") {
        super($axios);
    }

    /**
     * Adds prefix to request url
     * @param url
     * @returns
     */
    protected prepareUrl(url: string): string {
        if (this.prefix) {
            url = `${this.prefix}${url}`;
        }
        return url;
    }

    /**
     * Wrapper around $axios.get()
     * @param url
     * @param config
     * @returns
     */
    public async get(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<any>> {
        return this.$axios.get(this.prepareUrl(url), this.prepareConfig(config));
    }

    /**
     * Wrapper around $axios.request()
     * @param config
     * @returns
     */
    public async request(config: AxiosRequestConfig): Promise<AxiosResponse<any>> {
        return this.$axios.request(this.prepareConfig(config));
    }

    /**
     * Wrapper around $axios.delete()
     * @param url
     * @param config
     * @returns
     */
    public async delete(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<any>> {
        return this.$axios.delete(this.prepareUrl(url), this.prepareConfig(config));
    }

    /**
     * Wrapper around $axios.head()
     * @param url
     * @param config
     * @returns
     */
    public async head(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<any>> {
        return this.$axios.head(this.prepareUrl(url), this.prepareConfig(config));
    }

    /**
     * Wrapper around $axios.options()
     * @param url
     * @param config
     * @returns
     */
    public async options(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<any>> {
        return this.$axios.options(this.prepareUrl(url), this.prepareConfig(config));
    }

    /**
     * Wrapper around $axios.post()
     * @param url
     * @param data
     * @param config
     * @returns
     */
    public async post(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<any>> {
        return this.$axios.post(this.prepareUrl(url), data, this.prepareConfig(config));
    }

    /**
     * Wrapper around $axios.put()
     * @param url
     * @param data
     * @param config
     * @returns
     */
    public async put(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<any>> {
        return this.$axios.put(this.prepareUrl(url), data, this.prepareConfig(config));
    }

    /**
     * Wrapper around $axios.patch()
     * @param url
     * @param data
     * @param config
     * @returns
     */
    public async patch(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<any>> {
        return this.$axios.patch(this.prepareUrl(url), data, this.prepareConfig(config));
    }
}
