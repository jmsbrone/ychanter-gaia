import { Query } from "@ychanter/graphql-client";
import { GraphQLService } from "../../../core/components/graphql/graphql-service";
import { DIContainer } from "../../../core/port-manager";
import { File } from "../types/file";

export class ImageService {
    protected readonly graphql_service: GraphQLService;
    constructor() {
        this.graphql_service = DIContainer.get<GraphQLService>("GraphQLService");
    }
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
