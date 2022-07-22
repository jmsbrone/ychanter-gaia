import axios from "axios";
import { AxiosRequest } from "../core/components/axios-request";
import { GraphQLAxiosRequest } from "../core/components/graphql/graphql-axios-request";
import { GraphQLService } from "../core/components/graphql/graphql-service";
import { DIContainer } from "../core/port-manager";
import { AudioFileService } from "../modules/files/services/audio-service";
import { GalleryService } from "../modules/files/services/gallery-service";
import { PlaylistService } from "../modules/files/services/playlist-service";
import { AudioFile } from "../modules/files/types/audio-file";
import { WebPageService } from "../modules/web-pages/services/web-page-service";

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig();
    const SERVER_API = process.env.server ? config.backendApi : config.public.backendApi;
    const FILE_STORAGE_URL = config.public.storageUrl;

    const service = new GraphQLService(new GraphQLAxiosRequest(axios, SERVER_API + "/graphql"));

    DIContainer.register("AxiosRequest", new AxiosRequest(axios, SERVER_API));
    DIContainer.register("GraphQLService", service);
    DIContainer.register("WebPagesAPI", new WebPageService());
    DIContainer.register("GalleryAPI", new GalleryService());
    DIContainer.register("PlaylistAPI", new PlaylistService());
    DIContainer.register("AudioFileAPI", new AudioFileService());

    return {
        provide: {
            imageResize(id: number, width?: number, height?: number) {
                let baseUrl = `${SERVER_API}/files/image/resize`;
                let query = [`id=${id}`];
                if (width) {
                    query.push(`width=${width}`);
                }
                if (height) {
                    query.push(`height=${height}`);
                }

                return baseUrl + "?" + query.join("&");
            },
            audioLink(track: AudioFile) {
                return `${FILE_STORAGE_URL}/${track.file.path}`;
            },
        },
    };
});
