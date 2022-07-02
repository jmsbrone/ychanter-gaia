import { ClientStorage } from "client/core/components/storage/client-storage";
import { Query } from "@ychanter/graphql-client";
import { File } from "../types/file";

export class ImageService {
    constructor(protected readonly graphql_service = ClientStorage.getInstance().getGraphQLService()) {}
    /**
     * Retrieve image by id
     * @param id
     * @returns
     */
    public async getById(id: number): Promise<File | null> {
        if (!id) {
            return null;
        }
        return this.graphql_service.get(
            new Query("image")
                .vars({ id: { type: "Int!", value: id } })
                .args(["id"])
                .take("file{id,path}")
        );
    }
}
