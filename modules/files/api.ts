import { CreatePlaylistDto } from "./dto/playlist";
import { AudioFile } from "./types/audio-file";
import { Gallery } from "./types/gallery";
import { Image } from "./types/image";
import { Playlist } from "./types/playlist";

export interface GalleryAPI {
    /**
     * Returns gallery by id
     * @param id
     */
    getById(id: number): Promise<Gallery | null>;

    /**
     * Retrieves all galleries
     */
    getAll(): Promise<Gallery[]>;

    /**
     * Retrives all images for given gallery
     * @param gallery_id
     * @returns
     */
    getImages(gallery_id: number, limit?: number, offset?: number): Promise<Image[]>;

    /**
     * Adds new images to gallery and returns new total count of images
     * @param gallery_id
     * @param image_ids
     * @returns
     */
    addImages(gallery_id: number, image_ids: number[]): Promise<void>;

    /**
     * Detaches specified images from gallery. Does not delete files.
     * @param gallery_id
     * @param image_ids
     * @returns
     */
    detachImages(gallery_id: number, image_ids: number[]): Promise<void>;
}

export interface PlaylistAPI {
    /**
     * Returns playlist by id.
     *
     * @param id
     */
    getById(id: number): Promise<Playlist | null>;

    /**
     * Retrieves all playlists.
     */
    getAll(): Promise<Playlist[]>;

    /**
     * Adds tracks to the playlist.
     *
     * @param playlistId
     * @param trackIds
     */
    attachTrackToPlaylist(playlistId: number, trackIds: number[]): Promise<void>;

    /**
     * Removes tracks from playlist.
     *
     * @param playlistId
     * @param trackIds
     */
    detachFromPlaylist(playlistId: number, trackIds: number[]): Promise<void>;

    /**
     * Creates or updates playlist
     *
     * @param data
     */
    save(data: CreatePlaylistDto): Promise<Playlist>;
}

export interface AudioFileAPI {
    /**
     * Retrieve audio file by id
     *
     * @param id
     * @returns
     */
    getById(id: number): Promise<AudioFile | null>;
}
