import { AxiosRequestConfig, AxiosResponse } from "axios";
import { IAxiosRequest } from "./interface";

export class AxiosRequestMock implements IAxiosRequest {
    setUrlPrefix(url: string): void {}
    get(url: string, config?: AxiosRequestConfig<any>): Promise<AxiosResponse<any, any>> {
        throw new Error("Method not implemented.");
    }
    request(config: AxiosRequestConfig<any>): Promise<AxiosResponse<any, any>> {
        throw new Error("Method not implemented.");
    }
    delete(url: string, config?: AxiosRequestConfig<any>): Promise<AxiosResponse<any, any>> {
        throw new Error("Method not implemented.");
    }
    head(url: string, config?: AxiosRequestConfig<any>): Promise<AxiosResponse<any, any>> {
        throw new Error("Method not implemented.");
    }
    options(url: string, config?: AxiosRequestConfig<any>): Promise<AxiosResponse<any, any>> {
        throw new Error("Method not implemented.");
    }
    post(url: string, data?: any, config?: AxiosRequestConfig<any>): Promise<AxiosResponse<any, any>> {
        throw new Error("Method not implemented.");
    }
    put(url: string, data?: any, config?: AxiosRequestConfig<any>): Promise<AxiosResponse<any, any>> {
        throw new Error("Method not implemented.");
    }
    patch(url: string, data?: any, config?: AxiosRequestConfig<any>): Promise<AxiosResponse<any, any>> {
        throw new Error("Method not implemented.");
    }
}
