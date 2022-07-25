import _ from "lodash";
import { defineStore } from "pinia";
import { AudioFile } from "../modules/files/types/audio-file";
import { Playlist } from "../modules/files/types/playlist";

type StoreState = {
    playing: boolean;
    loopOne: boolean;
    queue: AudioFile[];
    currentTrackIndex: number | null;
    currentPlaylist: Playlist | null;
};

export const useMediaPlayerStore = defineStore({
    id: "audio-player",
    state: () => {
        return {
            playing: false,
            loopOne: false,
            queue: [],
            currentTrackIndex: null,
            currentPlaylist: null,
        } as StoreState;
    },
    getters: {
        currentTrackId(): number | null {
            if (this.currentTrackIndex !== null) {
                return this.queue[this.currentTrackIndex]?.file.id;
            }
        },
    },
    actions: {
        playTrackFromPlaylist(this: StoreState, playlist: Playlist, track: AudioFile) {
            if (!this.currentPlaylist || this.currentPlaylist.id !== playlist.id) {
                this.currentPlaylist = playlist;
                this.queue = playlist.tracks;
            }

            this.currentTrackIndex = _.findIndex(this.queue, (queueTrack) => queueTrack.file.id === track.file.id);
            this.playing = true;
            const { $trackEvent } = useNuxtApp();
            $trackEvent(track.file.id, "started_manual");
        },
        togglePlaying() {
            this.playing = !this.playing;
        },
    },
});
