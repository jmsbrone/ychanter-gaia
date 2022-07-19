<template lang="pug">
v-container(fluid)
    .d-flex.flex-row
        .text-h4 Playlist manager
        v-spacer
        v-btn(@click="openDialog()")
            v-icon(:icon="$ycIcon('add')")
            .text-body-1 Add playlist
    v-divider.my-2
    v-list(v-if="playlists")
        v-list-item(v-for="playlist in playlists", :key="playlist.id", :title="playlist.name", :value="playlist")
            template(v-slot:prepend)
                div.d-flex.pr-4.align-center
                    v-icon(:icon="$ycIcon('playlist')")
            template(v-slot:append)
                v-btn(nuxt, :to="`/admin/content/playlist/${playlist.id}`")
                    v-icon(:icon="$ycIcon('edit')")
                v-btn
                    v-icon(:icon="$ycIcon('delete')")

    v-dialog(v-model="addingPlaylist", persistent)
        v-card.pa-4
            v-card-title.align-center Creating new playlist
            v-card-text
                ui-form(:config="playlistFormConfig", v-model="formData")
            v-card-actions.justify-center
                v-btn(color="primary", @click="addPlaylist()") Save
                v-btn(color="secondary", @click="closeDialog()") Close
</template>

<script setup lang="ts">
import { DIContainer } from "../../../core/port-manager";
import type { FormConfig } from "../../../core/types/editor";
import { FieldType } from "../../../core/types/field-type-enum";
import type { PlaylistAPI } from "../../../modules/files/api";

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
const playlistFormConfig = {
    name: {
        type: FieldType.string,
        required: true,
        minlength: 4,
        name: "Playlist name",
    },
} as FormConfig;
const formData = {
    name: "",
};

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

const globalLoader = useGlobalLoader();
const notification = useAppNotification();
const playlists = ref(await service.getAll());
const addingPlaylist = ref(false);

/**
 * --------------------------------------------------------
 * User interaction handlers
 * --------------------------------------------------------
 */

function openDialog() {
    addingPlaylist.value = true;
}

function closeDialog() {
    addingPlaylist.value = false;
}

async function addPlaylist() {
    globalLoader.showBasic("saving changes");
    try {
        const playlist = await service.save(formData);
        playlists.value.push(playlist);
    } catch (error) {
        notification.showError(error);
    }
    closeDialog();
    globalLoader.close();
}

/**
 * --------------------------------------------------------
 * Event handlers
 * --------------------------------------------------------
 */
</script>
