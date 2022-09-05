<template lang="pug">
v-progress-circular(v-if="!playlist", indeterminate)
.d-flex.flex-column.fill-height(v-else)
    .d-flex.flex-row.align-center
        v-btn.mx-2(:icon="$ycIcon('back')", nuxt, to="/admin/content/playlists", color="secondary")
        .text-h6
            span Editing playlist
            v-icon.mx-2(:icon="$ycIcon('playlist')")
            span "{{ playlist.name }}" ({{ playlist.tracks.length }} tracks)
        v-spacer
        v-btn(@click="addTracks()", color="primary")
            v-icon(:icon="$ycIcon('add')")
            span Add Tracks
        ui-form-field-audio(ref="tracksInput", v-show="false", :config="tracksInputFieldConfig", name="", v-model="newTracks")
    v-divider.my-2
    v-list.tracks-container
        template(v-for="track in playlist.tracks",:key="track.name")
            v-list-item(
                :value="track",
                :class='["bg-" + (isCurrentTrack(track) ? "secondary-darken-2" : "surface")]',
                variant="flat"
            )
                template(v-slot:prepend)
                    v-icon(:icon="$ycIcon('playlist_track')")
                v-row.ml-2(no-gutters).align-center
                    v-btn.mx-2(:icon="$ycIcon(isCurrentTrack(track) && globalPlayer.playing ? 'pause_track' : 'play_track')", @click.stop="playTrack(track)", variant="plain")
                    .text-body-1 {{ track.name }}
            v-divider.bg-secondary
</template>

<script setup lang="ts">
import _ from "lodash";
import { Subject } from "rxjs";
import { DIContainer } from "../../../../../../core/port-manager";
import type { FormAudioFieldConfig } from "../../../../../../core/types/editor";
import { FieldType } from "../../../../../../core/types/field-type-enum";
import { useMediaPlayerStore } from "../../../../stores/player";
import type { PlaylistAPI, AudioFileAPI } from "../../../../api";
import { FileService } from "../../../../services/file-service";
import { AudioFile } from "../../../../types/audio-file";

/**
 * --------------------------------------------------------
 * Component definitions
 * --------------------------------------------------------
 */

definePageMeta({
    layout: "admin",
    middleware: ["auth"],
});

/**
 * --------------------------------------------------------
 * General variables
 * --------------------------------------------------------
 */

const service = DIContainer.get<PlaylistAPI>("PlaylistAPI");
const audioService = DIContainer.get<AudioFileAPI>("AudioFileAPI");
const tracksInputFieldConfig = {
    type: FieldType.audio,
    multiple: true,
} as FormAudioFieldConfig;
const globalLoader = useGlobalLoader();

function isCurrentTrack(track: AudioFile): boolean {
    return track.file.id === globalPlayer.currentTrackId;
}

/**
 * --------------------------------------------------------
 * Refs, states and watchers setup
 * --------------------------------------------------------
 */

const globalPlayer = useMediaPlayerStore();
const playlist = ref(await service.getById(parseInt(useRoute().params.id as string)));
const newTracks = ref([]);
const tracksInput = ref(null);

watch(newTracks, async (newValue) => {
    globalLoader.showBasic(`Preparing ${newValue.length} tracks for upload`);

    const fileService = new FileService();
    const uploadDtos = [];
    const uploadStats = {
        totalCount: newValue.length,
        uploadedCount: 0,
        totalChunks: 0,
        uploadedChunks: 0,
    };
    for (let i = 0; i < newValue.length; ++i) {
        const file = newValue[i];
        const uploadData = await fileService.prepareUploadForFile(file);
        uploadDtos.push(uploadData);
        uploadStats.totalChunks += uploadData.chunks;
    }

    const uploadObservable = new Subject<number>();
    globalLoader.showProgress(
        `Adding ${newValue.length} tracks to playlist`,
        uploadStats.totalChunks,
        uploadObservable
    );
    for (let i = 0; i < uploadDtos.length; ++i) {
        const uploadData = uploadDtos[i];
        uploadData.upload_observer.subscribe({
            next() {
                uploadObservable.next(1);
            },
        });

        const createdFile = await fileService.startFileUpload(uploadData);
        const audio = await audioService.getById(createdFile.id);
        await service.attachTrackToPlaylist(playlist.value.id, [createdFile.id]);
        playlist.value.tracks.push(audio);
    }
    globalLoader.close();
});

/**
 * --------------------------------------------------------
 * User interaction handlers
 * --------------------------------------------------------
 */

function addTracks() {
    tracksInput.value.click();
}

function playTrack(track: AudioFile) {
    if (isCurrentTrack(track)) {
        globalPlayer.togglePlaying();
    } else {
        globalPlayer.playTrackFromPlaylist(playlist.value, track);
    }
}
</script>

<style lang="scss" scoped>
.tracks-container {
    overflow-y: auto;
}
</style>
