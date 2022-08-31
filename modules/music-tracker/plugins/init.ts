import { Mutation } from "@ychanter/graphql-client";
import { GraphQLService } from "../../../core/components/graphql/graphql-service";
import { DIContainer } from "../../../core/port-manager";

export default defineNuxtPlugin((app) => {
    return {
        provide: {
            trackEvent(trackId: number, event: string) {
                DIContainer.get<GraphQLService>("GraphQLService").get(
                    new Mutation("trackPlaylistTrackEvent").args(["track_id", "event"]).vars({
                        track_id: { type: "Int!", value: trackId },
                        event: { type: "String!", value: event },
                    })
                );
            },
        },
    };
});
