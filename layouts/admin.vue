<template lang="pug">
v-layout
    client-only
        template(#fallback)
            | loading...
        v-app-bar(color="accent")
            v-app-bar-nav-icon
            v-app-bar-title Admin panel
            v-spacer
            v-btn(variant="text", :icon="$ycIcon('dots-vertical')")
        v-navigation-drawer
            v-list.text-h5(nav, color="secondary")
                v-list-item(nuxt, to="/admin", exact)
                    v-list-item-icon(:icon="$ycIcon('home')")
                    v-list-item-title.pl-2.font-weight-bold Home
                v-divider
                v-list-item(nuxt, to="/admin/web-pages", exact)
                    v-list-item-icon(:icon="$ycIcon('webpage_tree')")
                    v-list-item-title.pl-2.font-weight-bold Web pages
                v-list-item(nuxt, to="/admin/content", exact)
                    v-list-item-icon(:icon="$ycIcon('content')")
                    v-list-item-title.pl-2.font-weight-bold Content
                v-divider
                v-list-item(nuxt, to="/admin/settings", exact)
                    v-list-item-icon(:icon="$ycIcon('settings')")
                    v-list-item-title.pl-2.font-weight-bold Settings
        v-main
            v-sheet.ma-2.pa-6.rounded-lg
                NuxtPage
            v-snackbar(v-model="notificationState.open", location="top", timeout="5000", transition="fade-transition")
                div.text-body-1(:class="getClassForNotification()")
                    v-icon(:icon="$ycIcon(getIconForNotification())")
                    span.ml-2.my-auto {{ notificationState.text }}
                template(v-slot:actions)
                    v-btn(variant="plain", color="white" :icon="$ycIcon('close')", @click="closeNotification()")
            confirmation-dialog(
                v-model="confirmationDialogState.open",
                :title="confirmationDialogState.title",
                :text="confirmationDialogState.text",
                @confirm="onConformationDialogConfirm()",
                @cancel="onConformationDialogCancel()"
            )
            v-dialog(v-model="globalLoaderState.open", persistent)
                v-card.pa-6
                    v-card-title.text-center Please wait...
                    v-card-text
                        v-row(no-gutters).justify-center
                            template(v-if="globalLoaderState.indeterminate")
                                v-progress-linear(indeterminate)
                            template(v-else)
                                v-progress-linear(:model-value="globalLoaderState.progressCurrent / globalLoaderState.progressTotal * 100", :height="25")
                                    template(v-slot:default="{value}")
                                        strong {{ Math.round(value) }}%
                            .text-subtitle-1 {{ globalLoaderState.text }}
        v-footer.app-footer(app, v-show="currentPlayerTrack")
            audio(
                @ended="onTrackEnded()",
                ref="playerElement",
                type="audio/mpeg",
                autoplay,
            )
            v-row.flex-row.align-center(no-gutters, v-if="currentPlayerTrack")
                v-btn.ml-2(:icon="$ycIcon('player_previous')", @click="playPrevious()", variant="outlined")
                v-btn(:icon="$ycIcon(player.playing ? 'player_pause' : 'player_play')", @click="togglePlayState()", color="yellow")
                v-btn.mr-2(:icon="$ycIcon('player_next')", @click="playNext()", variant="outlined")
                v-col
                    .d-flex.flex-column.flex-auto
                        .text-body-2.font-weight-bold {{ currentPlayerTrack.name }}
                        v-progress-linear.my-1(:modelValue="currentTrackTime / currentTrackDuration * 100", color="yellow", bg-color="primary-lighten-2")
                        .d-flex.flex-row
                            .text-subtitle-2 {{ Math.floor(currentTrackTime / 60) }}:{{ currentTrackTime < 10 ? '0' : '' }}{{ Math.ceil(currentTrackTime % 60) }}
                            v-spacer
                            .text-subtitle-2 {{ Math.floor(currentTrackDuration / 60) }}:{{ currentTrackDuration < 10 ? '0' : '' }}{{ Math.ceil(currentTrackDuration % 60)}}
</template>

<script setup lang="ts">
import type { Ref } from "vue";
import { AudioFile } from "../modules/files/types/audio-file";
import { useMediaPlayerStore } from "../store/player";

/**
 * --------------------------------------------------------
 * General variables
 * --------------------------------------------------------
 */

const { $audioLink } = useNuxtApp();
let playerTrackIntervalWatcherId = null;

/**
 * --------------------------------------------------------
 * Template getters
 * --------------------------------------------------------
 */

function getClassForNotification() {
    switch (notificationState.value.type) {
        case "error":
            return "text-error";
        case "success":
            return "text-success";
        case "info":
            return "text-info";
    }
}

function getIconForNotification() {
    return "notification-" + notificationState.value.type;
}

/**
 * --------------------------------------------------------
 * Refs, states and watchers setup
 * --------------------------------------------------------
 */

const notificationState = useAppNotificationState();
const notification = useAppNotification();
const confirmationDialogState = useConfirmationDialogState();
const globalLoaderState = useGlobalLoaderState();
const player = useMediaPlayerStore();
const playerElement: Ref<HTMLAudioElement> = ref(null);
const currentPlayerTrack: Ref<AudioFile> = ref(null);
const currentTrackTime: Ref<number> = ref(0);
const currentTrackDuration: Ref<number> = ref(1);

player.$subscribe((_mutation, state) => {
    if (!playerElement.value) {
        notification.showError("Player is missing");
        return;
    }

    if (state.queue.length == 0) {
        return;
    }

    const trackFromState = state.queue[state.currentTrackIndex];
    if (trackFromState !== currentPlayerTrack.value) {
        currentPlayerTrack.value = trackFromState;
    } else if (state.playing) {
        playerElement.value.play();
    } else {
        playerElement.value.pause();
    }
});

watch(currentPlayerTrack, (newValue) => {
    playerElement.value.src = $audioLink(newValue);
    playerElement.value.load();

    if (player.playing) {
        playerElement.value.play();
    } else {
        playerElement.value.pause();
    }
});

/**
 * --------------------------------------------------------
 * User interaction handlers
 * --------------------------------------------------------
 */

function closeNotification() {
    notificationState.value.open = false;
}

function onConformationDialogConfirm() {
    if (confirmationDialogState.value.confirmCallback) {
        confirmationDialogState.value.confirmCallback();
    }

    confirmationDialogState.value.open = false;
}

function onConformationDialogCancel() {
    if (confirmationDialogState.value.cancelCallback) {
        confirmationDialogState.value.cancelCallback();
    }

    confirmationDialogState.value.open = false;
}

function togglePlayState() {
    player.playing = !player.playing;
}

function playPrevious() {
    let newIndex = player.currentTrackIndex - 1;
    if (newIndex < 0) {
        newIndex = player.queue.length - 1;
    }
    player.currentTrackIndex = newIndex;
}

function playNext() {
    let newIndex = player.currentTrackIndex + 1;
    if (newIndex >= player.queue.length) {
        newIndex = 0;
    }
    player.currentTrackIndex = newIndex;
}

/**
 * --------------------------------------------------------
 * Event handlers
 * --------------------------------------------------------
 */

function onTrackEnded() {
    let newIndex = player.currentTrackIndex + 1;
    if (newIndex >= player.queue.length) {
        newIndex = 0;
    }
    player.currentTrackIndex = newIndex;
}

onMounted(() => {
    playerTrackIntervalWatcherId = setInterval(() => {
        if (currentPlayerTrack.value) {
            currentTrackTime.value = playerElement.value.currentTime;
            currentTrackDuration.value = playerElement.value.duration;
        }
    }, 200);
});

onBeforeUnmount(() => {
    clearInterval(playerTrackIntervalWatcherId);
});
</script>

<style lang="scss">
.app-footer {
    box-shadow: 0 -2px 10px yellow;
}
</style>
