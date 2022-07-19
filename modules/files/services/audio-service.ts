import { Query } from "@ychanter/graphql-client";
import { GraphQLService } from "../../../core/components/graphql/graphql-service";
import { DIContainer } from "../../../core/port-manager";
import { AudioFileAPI } from "../api";
import { AudioFile } from "../types/audio-file";

export class AudioFileService implements AudioFileAPI {
    protected readonly graphql_service: GraphQLService;

    public constructor() {
        this.graphql_service = DIContainer.get<GraphQLService>("GraphQLService");
    }
    /**
     * Retrieve image by id
     * @param id
     * @returns
     */
    public async getById(id: number): Promise<AudioFile | null> {
        if (!id) {
            return null;
        }
        return this.graphql_service.get(
            new Query("audio")
                .vars({ id: { type: "Int!", value: id } })
                .args(["id"])
                .take("name,file{id,path}")
        );
    }
}
