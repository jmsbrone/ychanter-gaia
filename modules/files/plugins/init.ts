import { DIContainer } from "../../../core/port-manager";
import { AudioFileService } from "../services/audio-service";
import { GalleryService } from "../services/gallery-service";
import { PlaylistService } from "../services/playlist-service";
import { AudioFile } from "../types/audio-file";

export default defineNuxtPlugin((app) => {
    const config = useRuntimeConfig();
    const SERVER_API = process.env.server ? config.backendApi : config.public.backendApi;
    const FILE_STORAGE_URL = config.public.storageUrl;

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
