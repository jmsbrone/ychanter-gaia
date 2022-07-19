import { CRUDResourceSchema, CRUDResourceSchemaPrototype } from "@ychanter/graphql-client";
import { EntityServicePrototype } from "../../../core/prototypes/entity-service-prototype";
import { PlaylistAPI } from "../api";
import { CreatePlaylistDto, DeletePlaylistDto, UpdatePlaylistDto } from "../dto/playlist";
import { Playlist } from "../types/playlist";

export class PlaylistService
    extends EntityServicePrototype<Playlist, CreatePlaylistDto, UpdatePlaylistDto, DeletePlaylistDto>
    implements PlaylistAPI
{
    protected createSchema(): CRUDResourceSchema {
        return new CRUDResourceSchemaPrototype({
            listResourceQuery: "playlists",
            saveResourceQuery: "createPlaylist",
            singleResourceQuery: "playlist",
            deleteResourceQuery: "deletePlaylist",
            queries: {
                playlist: ["id"],
                playlists: [],
                updatePlaylist: ["name", "id"],
                deletePlaylist: ["id"],
                addTracksToPlaylist: ["playlistId", "trackIds"],
                removeTracksFromPlaylist: ["playlistId", "trackIds"],
                createPlaylist: ["name"],
                trackPlaylistTrackEvent: ["event", "track_id"],
            },
            fieldsTypes: {
                id: "Int",
                name: "String",
                playlistId: "Int",
                trackIds: "[Int!]",
                event: "String",
                track_id: "Int",
            },
        });
    }
    protected getUsedEntityFields(): string[] {
        return ["id", "name", "tracks{name,file{id,path}}"];
    }

    public attachTrackToPlaylist(playlistId: number, trackIds: number[]) {
        return this.graphql_service.get(
            this.schema.getMutation("addTracksToPlaylist", { playlistId, trackIds }, ["id"])
        );
    }

    public detachFromPlaylist(playlistId: number, trackIds: number[]) {
        return this.graphql_service.get(
            this.schema.getMutation("removeTracksFromPlaylist", { playlistId, trackIds }, ["id"])
        );
    }

    public sendTrackEvent(track_id: number, event: string) {
        this.graphql_service.get(this.schema.getMutation("trackPlaylistTrackEvent", { track_id, event }, []));
    }

    constructor() {
        super(Playlist);
    }
}
