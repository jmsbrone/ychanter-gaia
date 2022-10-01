import { AxiosRequestConfig, AxiosResponse } from "axios";

/**
 * Key for this port in dependency injector.
 */
export const AxiosRequestPort = "AxiosRequest";

/**
 * Interface for using axios request.
 */

export interface IAxiosRequest {
    /**
     * Sets prefix that will be used for all requests via this instance.
     * @param url
     */
    setUrlPrefix(url: string): void;

    /**
     * Wrapper around $axios.get()
     * @param url
     * @param config
     * @returns
     */
    get(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<any>>;

    /**
     * Wrapper around $axios.request()
     * @param config
     * @returns
     */
    request(config: AxiosRequestConfig): Promise<AxiosResponse<any>>;

    /**
     * Wrapper around $axios.delete()
     * @param url
     * @param config
     * @returns
     */
    delete(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<any>>;

    /**
     * Wrapper around $axios.head()
     * @param url
     * @param config
     * @returns
     */
    head(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<any>>;

    /**
     * Wrapper around $axios.options()
     * @param url
     * @param config
     * @returns
     */
    options(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<any>>;

    /**
     * Wrapper around $axios.post()
     * @param url
     * @param data
     * @param config
     * @returns
     */
    post(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<any>>;

    /**
     * Wrapper around $axios.put()
     * @param url
     * @param data
     * @param config
     * @returns
     */
    put(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<any>>;

    /**
     * Wrapper around $axios.patch()
     * @param url
     * @param data
     * @param config
     * @returns
     */
    patch(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<any>>;
}
