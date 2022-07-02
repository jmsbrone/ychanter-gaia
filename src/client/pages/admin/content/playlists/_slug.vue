<template lang="pug">
include ../../../../modules/ui/templates/icons.pug
include ../../../../modules/ui/templates/buttons.pug

div(v-if="playlist")
    v-toolbar
        +icon_btn("back")(
            nuxt,
            to="/admin/content/playlists",
            title="Return"
        )
        v-toolbar-title
            span.ma-2
                strong(v-if="playlist.name") {{ playlist.name }}
                span(v-else) #{ "<no name>" }
            span.ml-1 [ID: {{ playlist.id }}]
        v-spacer
        v-btn(@click="clickFileInput")
            +icon("add")
            div Add tracks

    v-sheet.pa-4
        template(v-show="currentTrack")
            v-row.ma-auto.justify-center
                div {{ currentTrack ? currentTrack.name : 'Nothing is playing' }}
            v-row.mb-4
                audio(
                    controls,
                    @ended="onTrackEnded",
                    :ref="playerId",
                    type="audio/mpeg",
                    style="width: 100%"
                )
        .my-1.d-flex.flex-column(
            v-for="track in playlist.tracks",
            no-gutters,
            :key="track.id"
        )
            v-hover
                template(v-slot:default="{ hover }")
                    v-card.d-flex.flex-row.pa-2(
                        :elevation="(currentTrack === track ? 16 : 4) + (hover ? 8 : 0)",
                        outlined
                    )
                        +icon_btn("play")(
                            v-if="currentTrack !== track || !isPlaying",
                            @click="selectTrack(track)"
                        )
                        +icon_btn("pause")(
                            v-if="currentTrack === track && isPlaying",
                            @click="pause()"
                        )
                        .my-auto.text-body-1-bold.ml-4 {{ track.name }}
                        +icon_btn("delete")(
                            @click="removeFromPlaylist(track)"
                        )

        .pt-4(v-if="upload_data")
            v-row.my-2(
                v-for="file_upload in upload_data.file_uploads",
                no-gutters,
                :key="file_upload.file.name"
            )
                div {{ file_upload.file.name }}
                v-progress-linear(
                    :value="(file_upload.uploaded_chunks / file_upload.chunks) * 100"
                )

    div(v-show="false")
        FormFieldAudio(
            :config="audioFieldConfig",
            v-model="files",
            ref="audio_field",
            @upload_start="onUploadStart",
            @upload_end="onUploadEnd"
        )
</template>

<script lang="ts">
import _ from "client/helpers/lodash";
import { Component, Vue, Watch } from "nuxt-property-decorator";
import { FieldType } from "../../../../../common/core/types/field-type-enum";
import { PlaylistService } from "../../../../modules/file/services/playlist-service";
import { AudioFile } from "../../../../modules/file/types/audio-file";
import { Playlist } from "../../../../modules/file/types/playlist";
import { FormAudioFieldConfig } from "../../../../types/editor";

@Component({})
export default class AdminContentPlaylistDetail extends Vue {
    playlistId: number = null;
    playlist: Playlist = null;
    playerId: string = "playlist_player_element";
    files: any[] = [];
    audioFieldConfig: FormAudioFieldConfig = {
        name: "track",
        type: FieldType.audio,
        multiple: true,
        is_file_value: true,
        mimetyping: ["audio/mpeg", "audio/mp3"],
    };
    service: PlaylistService = new PlaylistService();
    currentTrack: AudioFile = null;
    isPlaying: boolean = false;
    upload_data = null;

    async asyncData({ params }) {
        return { playlistId: parseInt(params.slug) };
    }

    async beforeMount() {
        await this.updatePlaylist();
    }

    async updatePlaylist() {
        this.playlist = await this.service.getById(this.playlistId);
    }

    /**
     * Wrapper function to call hidden image field
     */
    clickFileInput() {
        (this.$refs.audio_field as any).click();
    }

    /**
     * Receive upload data
     */
    onUploadStart(upload_data) {
        this.upload_data = upload_data;
        console.log(upload_data);
    }

    /**
     * Handler for upload finish
     */
    onUploadEnd() {
        this.upload_data = null;
    }

    /**
     * Called when input value changes, i.e. when user selects more images
     */
    @Watch("files")
    async onFilesChanges() {
        if (!this.files) {
            return;
        }

        const track_ids = _.map(this.files, "id");
        await this.service.attachTrackToPlaylist(this.playlistId, track_ids);
        await this.updatePlaylist();
    }

    onTrackEnded() {
        let currentTrackIndex = this.playlist.tracks.findIndex(
            (item) => item === this.currentTrack
        );
        if (++currentTrackIndex >= this.playlist.tracks.length) {
            currentTrackIndex = 0;
        }

        const newTrack = this.playlist.tracks[currentTrackIndex];
        this.service.sendTrackEvent(newTrack.file.id, "started_auto");
        this.playTrack(newTrack);
    }

    selectTrack(track: AudioFile) {
        this.service.sendTrackEvent(track.file.id, "started_manual");
        this.playTrack(track);
    }

    removeFromPlaylist(track: AudioFile) {
        this.service.detachFromPlaylist(this.playlistId, [track.file.id]);
        this.playlist.tracks.splice(this.playlist.tracks.indexOf(track), 1);
    }

    playTrack(track: AudioFile) {
        const audioElement = this.$refs[this.playerId] as any;
        if (this.currentTrack !== track) {
            audioElement.src = "/" + track.file.path;
            audioElement.load();
            this.currentTrack = track;
        }
        audioElement.play();
        this.isPlaying = true;
    }

    pause() {
        const audioElement = this.$refs[this.playerId] as any;
        audioElement.pause();
        this.isPlaying = false;
    }
}
</script>
