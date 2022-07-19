<template lang="pug">
v-progress-circular(v-if="!playlist", indeterminate)
v-container(v-else, fluid)
    div.d-flex.align-center.ma-4
        v-btn(:icon="$ycIcon('back')", nuxt, to="/admin/content/playlists")
        .text-h6 Editing playlist "{{ playlist.name }}" ({{ playlist.tracks.length }}
            v-icon(:icon="$ycIcon('playlist')")
            | )
        v-spacer
        v-btn(@click="addTracks()")
            v-icon(:icon="$ycIcon('add')")
            span Add Tracks
        ui-form-field-audio(ref="tracksInput", v-show="false", :config="tracksInputFieldConfig", name="", v-model="newTracks")
    v-divider.mb-2
    v-list(dense)
        v-list-item(v-for="track in playlist.tracks", :key="track.name", :value="track")
            template(v-slot:prepend)
                v-icon(:icon="$ycIcon('playlist_track')")
            v-row.ml-2(no-gutters).align-center
                v-btn.ma-2(:icon="$ycIcon('play_track')", @click.stop="playTrack(track)")
                .text-body-1 {{ track.name }}

</template>

<script setup lang="ts">
import _ from "lodash";
import { Subject } from "rxjs";
import { DIContainer } from "../../../../core/port-manager";
import type { FormAudioFieldConfig } from "../../../../core/types/editor";
import { FieldType } from "../../../../core/types/field-type-enum";
import type { AudioFileAPI, PlaylistAPI } from "../../../../modules/files/api";
import { FileService } from "../../../../modules/files/services/file-service";
import { AudioFile } from "../../../../modules/files/types/audio-file";
import { useMediaPlayerStore } from "../../../../store/player";

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

/**
 * --------------------------------------------------------
 * Template getters
 * --------------------------------------------------------
 */

// Functions for usage in template

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
    globalLoader.showBasic(`preparing ${newValue.length} tracks for upload`);

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
    globalLoader.showProgress(`adding tracks`, uploadStats.totalChunks, uploadObservable);
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
    globalPlayer.playTrackFromPlaylist(playlist.value, track);
}

/**
 * --------------------------------------------------------
 * Event handlers
 * --------------------------------------------------------
 */

// Functions that will run in response to component events
// that are not caused by the user directly

/**
 * --------------------------------------------------------
 * Exposed methods
 * --------------------------------------------------------
 */

// API methods and properties for the component that
// can be accessed from parent component
</script>
