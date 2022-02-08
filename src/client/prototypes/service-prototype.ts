/**
 * @module Prototypes
 */
import { AxiosRequestConfig } from "@nuxtjs/axios/node_modules/axios";
import _ from "client/helpers/lodash";
import { AxiosRequest } from "client/core/components/axios-request";
import { ClientStorage } from "client/core/components/storage/client-storage";
import { PlainObject } from "../types/basic";

/**
 * Generic class for services for resources accessed via REST
 */
export class RESTResourceService<S, CreateType extends PlainObject, UpdateType extends PlainObject> {
    /**
     * Child class should specify path to resource relative to api prefix
     * @param resource
     */
    protected constructor(
        private resource: string,
        protected readonly rest_request: AxiosRequest = ClientStorage.getInstance().getAxiosRequest()
    ) {}

    /**
     * REST GET request by id
     * @param id
     * @param config
     * @returns
     */
    public async getById(id: number, config?: AxiosRequestConfig): Promise<S> {
        if (!id) {
            return null;
        }
        const response = await this.rest_request.get(`/${this.resource}/${id}`, config);
        return response.data;
    }

    /**
     * REST GET request with specified suffix path which expects array
     * @param suffix
     * @param config
     * @returns
     */
    public async getCustomList(suffix: string, config?: AxiosRequestConfig): Promise<S[]> {
        const response = await this.rest_request.get(`/${this.resource}/${suffix}`, config);
        return response.data;
    }

    /**
     * REST GET request with specified suffix path which expects single element
     * @param suffix
     * @param config
     * @returns
     */
    public async getCustomOne(suffix: string, config?: AxiosRequestConfig): Promise<S> {
        const response = await this.rest_request.get(`/${this.resource}/${suffix}`, config);
        const item = response.data;
        if (_.isArray(item)) {
            return item.shift();
        }
        return item;
    }

    /**
     * REST GET to base url
     * @param config
     * @returns
     */
    public async getAll(config?: AxiosRequestConfig): Promise<S[]> {
        const response = await this.rest_request.get(`/${this.resource}/`, config);
        return response.data;
    }

    /**
     * REST POST request
     * @param data
     * @returns
     */
    public async add(data: CreateType, config?: AxiosRequestConfig): Promise<S> {
        const response = await this.rest_request.post(`/${this.resource}/`, data, config);
        return response.data;
    }

    /**
     * REST PATCH request by id
     * @param data
     * @returns
     */
    public async update(data: UpdateType, config?: AxiosRequestConfig): Promise<S> {
        const response = await this.rest_request.patch(`/${this.resource}/${data.id}`, data, config);
        return response.data;
    }

    /**
     * REST PATCH request with custom url
     * @param url
     * @param data
     * @param config
     * @returns
     */
    public async updateCustom<UpdateCustomDto>(
        url: string,
        data: UpdateCustomDto,
        config?: AxiosRequestConfig
    ): Promise<S> {
        const response = await this.rest_request.patch(`/${this.resource}/${url}`, data, config);
        return response.data;
    }

    /**
     * REST DELETE request by id
     * @param id
     * @returns
     */
    public async delete(id: number, config?: AxiosRequestConfig): Promise<boolean> {
        const response = await this.rest_request.delete(`/${this.resource}/${id}`, config);
        return response.data;
    }
}
