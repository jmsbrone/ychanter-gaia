<template lang="pug">
.d-flex.flex-column.fill-height
    .d-flex.flex-row
        .text-h4 Playlist manager
        v-spacer
        v-btn(@click="openDialog()", color="primary")
            v-icon(:icon="$ycIcon('add')")
            span Add playlist
    v-divider.my-2
    v-list(v-if="playlists")
        template(v-for="(playlist,index) in playlists", :key="playlist.id")
            v-list-item(
                :title="playlist.name",
                :value="playlist",
                @click="$router.push(`/admin/content/playlist/${playlist.id}`)"
            )
                template(v-slot:prepend)
                    div.d-flex.pr-4.align-center
                        v-icon(:icon="$ycIcon('playlist')")
                template(v-slot:append)
                    .d-flex.flex-row.bg-secondary.rounded-lg.px-1
                        v-btn(@click.stop="deletePlaylist(index)", :icon="$ycIcon('delete')", variant="plain")
            v-divider.bg-secondary

    v-dialog(v-model="addingPlaylist", persistent)
        v-card.pa-4
            v-card-title.align-center Creating new playlist
            v-card-text
                ui-form(:config="playlistFormConfig", v-model="formData", ref="playlistForm")
            v-card-actions.justify-center
                v-btn(color="primary", @click="addPlaylist()") Save
                v-btn(color="secondary", @click="closeDialog()") Close
</template>

<script setup lang="ts">
import { DIContainer } from "../../../../../core/port-manager";
import type { FormConfig } from "../../../../../core/types/editor";
import { FieldType } from "../../../../../core/types/field-type-enum";
import type { PlaylistAPI } from "../../../api";

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
const confirmationDialog = useConfirmationDialog();
const playlists = ref(await service.getAll());
const addingPlaylist = ref(false);
const playlistForm = ref(null);

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
    const validationResult = await playlistForm.value.valid();
    if (!validationResult.valid) {
        return;
    }
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

function deletePlaylist(index: number) {
    const playlist = playlists.value[index];
    confirmationDialog.confirm(
        `Deleting playlist ${playlist.name}`,
        "Are you sure? This action cannot be undone.",
        async function () {
            if (await service.delete({ id: playlist.id })) {
                playlists.value.splice(index, 1);
                notification.showSuccess("Playlist deleted");
            } else {
                notification.showError("Cannot delete playlist");
            }
        }
    );
}

/**
 * --------------------------------------------------------
 * Event handlers
 * --------------------------------------------------------
 */
</script>
