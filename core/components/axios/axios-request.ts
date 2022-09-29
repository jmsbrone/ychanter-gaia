import { Axios, AxiosRequestConfig, AxiosResponse } from "axios";
import { AxiosRequestBase } from "../../prototypes/axios-request-base";
import { IAxiosRequest } from "./interface";

/**
 * Implementation of axios request
 */
export class AxiosRequest extends AxiosRequestBase implements IAxiosRequest {
    /**
     * URL prefix for all request.
     */
    protected prefix: string = "";

    public constructor(protected readonly $axios: Axios) {
        super($axios);
    }

    /**
     * Sets prefix that will be used for all requests via this instance.
     * @param url
     */
    public setUrlPrefix(url: string): void {
        this.prefix = url;
    }

    /** @inheritdoc */
    protected prepareUrl(url: string): string {
        if (this.prefix) {
            url = `${this.prefix}${url}`;
        }
        return url;
    }

    /** @inheritdoc */
    public async get(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<any>> {
        return this.$axios.get(this.prepareUrl(url), this.prepareConfig(config));
    }

    /** @inheritdoc */
    public async request(config: AxiosRequestConfig): Promise<AxiosResponse<any>> {
        return this.$axios.request(this.prepareConfig(config));
    }

    /** @inheritdoc */
    public async delete(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<any>> {
        return this.$axios.delete(this.prepareUrl(url), this.prepareConfig(config));
    }

    /** @inheritdoc */
    public async head(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<any>> {
        return this.$axios.head(this.prepareUrl(url), this.prepareConfig(config));
    }

    /** @inheritdoc */
    public async options(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<any>> {
        return this.$axios.options(this.prepareUrl(url), this.prepareConfig(config));
    }

    /** @inheritdoc */
    public async post(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<any>> {
        return this.$axios.post(this.prepareUrl(url), data, this.prepareConfig(config));
    }

    /** @inheritdoc */
    public async put(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<any>> {
        return this.$axios.put(this.prepareUrl(url), data, this.prepareConfig(config));
    }

    /** @inheritdoc */
    public async patch(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<any>> {
        return this.$axios.patch(this.prepareUrl(url), data, this.prepareConfig(config));
    }
}
