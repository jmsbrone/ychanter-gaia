/**
 * @summary
 *
 * Service for working with images
 */

import { ClientStorage } from "client/core/components/storage/client-storage";
import { Query } from "common/lib/graphql/query";
import { File } from "../types/file";

export class ImageService {
    constructor(protected readonly graphql_service = ClientStorage.getInstance().getGraphQLService()) {}
    /**
     * Retrieve image by id
     * @param id
     * @returns
     */
    public async getById(id: number): Promise<File> {
        return this.graphql_service.get(new Query("image").with({ id }).take("file{id,path}"));
    }
}
