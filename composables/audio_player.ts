import _ from "lodash";
import { AudioFile } from "../modules/files/types/audio-file";
import { Playlist } from "../modules/files/types/playlist";

export const useGlobalPlayerState = () =>
    useState("globalPlayer", () => {
        return {
            playing: false,
            loopOne: false,
            queue: [],
            currentTrackIndex: null,
            currentPlaylist: null,
        } as {
            playing: boolean;
            loopOne: boolean;
            queue: AudioFile[];
            currentTrackIndex: number | null;
            currentPlaylist: Playlist | null;
        };
    });

export function useGlobalPlayer() {
    const globalPlayerState = useGlobalPlayerState();

    return {
        playTrackFromPlaylist(playlist: Playlist, track: AudioFile) {
            if (
                !globalPlayerState.value.currentPlaylist ||
                globalPlayerState.value.currentPlaylist.id !== playlist.id
            ) {
                globalPlayerState.value.currentPlaylist = playlist;
                globalPlayerState.value.queue = playlist.tracks;
            }

            globalPlayerState.value.currentTrackIndex = _.findIndex(
                globalPlayerState.value.queue,
                (queueTrack) => queueTrack.file.id === track.file.id
            );
            globalPlayerState.value.playing = true;
        },
    };
}
