import { Query } from "@ychanter/graphql-client";
import { ClientStorage } from "../../../core/components/storage/client-storage";

export class AudioFileService {
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
            new Query("audio")
                .vars({ id: { type: "Int!", value: id } })
                .args(["id"])
                .take("file{id,path}")
        );
    }
}
