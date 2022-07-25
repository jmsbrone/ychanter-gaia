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
            v-list(nav, color="secondary")
                template(v-for="(menuGroup, code) in leftMenu.getItems()", :key="code")
                    .text-h6(v-if="menuGroup.name") {{ menuGroup.name }}
                    template(v-for="(menuItem, index) in menuGroup.items", :key="index")
                        v-list-item(nuxt, :to="menuItem.path", exact)
                            v-list-item-icon(:icon="$ycIcon(menuItem.icon)")
                            v-list-item-title.pl-2.font-weight-bold {{ menuItem.title }}
                    v-divider
        v-main
            v-sheet.ma-2.pa-6.rounded-lg
                NuxtPage
            v-snackbar(v-model="notificationState.open", location="top", timeout="3000", transition="fade-transition")
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
                                v-progress-linear(indeterminate, color="accent")
                            template(v-else)
                                v-progress-linear(
                                    :model-value="globalLoaderState.progressCurrent / globalLoaderState.progressTotal * 100",
                                    :height="25",
                                    color="accent",
                                    bg-color="secondary"
                                )
                                    template(v-slot:default="{value}")
                                        strong.text-foreground-text {{ Math.round(value) }}%
                            .text-subtitle-1.mt-1 {{ globalLoaderState.text }}
        v-footer.app-footer(app, v-show="currentPlayerTrack")
            audio(
                @ended="onTrackEnded()",
                ref="playerElement",
                type="audio/mpeg",
                autoplay,
            )
            v-row.flex-row.align-center(no-gutters, v-if="currentPlayerTrack")
                v-btn.ml-2(:icon="$ycIcon('player_previous')", @click="playPrevious()", variant="outlined")
                v-btn.mx-1(:icon="$ycIcon(player.playing ? 'player_pause' : 'player_play')", @click="togglePlayState()", variant="outlined")
                v-btn.mr-2(:icon="$ycIcon('player_next')", @click="playNext()", variant="outlined")
                v-col
                    .d-flex.flex-column.flex-auto
                        .text-body-2.font-weight-bold {{ currentPlayerTrack.name }}
                        v-progress-linear.my-1(:modelValue="currentTrackTime / currentTrackDuration * 100", color="accent", bg-color="primary-lighten-2")
                        .d-flex.flex-row
                            .text-subtitle-2 {{ Math.floor(currentTrackTime / 60) }}:{{ (currentTrackTime % 60) < 10 ? '0' : '' }}{{ Math.floor(currentTrackTime % 60) }}
                            v-spacer
                            .text-subtitle-2 {{ Math.floor(currentTrackDuration / 60) }}:{{ (currentTrackDuration % 60) < 10 ? '0' : '' }}{{ Math.ceil(currentTrackDuration % 60)}}
                v-btn.mx-2(:icon="$ycIcon('repeat_track')", :variant="player.loopOne ? 'outlined' : 'plain'", @click="toggleTrackLooping()")
</template>

<script setup lang="ts">
import type { Ref } from "vue";
import type { GraphQLService } from "../core/components/graphql/graphql-service";
import { DIContainer } from "../core/port-manager";
import { AudioFile } from "../modules/files/types/audio-file";
import { useMediaPlayerStore } from "../store/player";

/**
 * --------------------------------------------------------
 * General variables
 * --------------------------------------------------------
 */

const { $audioLink } = useNuxtApp();
let playerTrackIntervalWatcherId = null;
const graphql_service = DIContainer.get<GraphQLService>("GraphQLService");

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
        case "warning":
            return "text-warning";
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
const leftMenu = useAdminLeftMenu();
const { $trackEvent } = useNuxtApp();

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

async function onConformationDialogConfirm() {
    if (confirmationDialogState.value.confirmCallback) {
        await confirmationDialogState.value.confirmCallback();
    }

    confirmationDialogState.value.open = false;
}

async function onConformationDialogCancel() {
    if (confirmationDialogState.value.cancelCallback) {
        await confirmationDialogState.value.cancelCallback();
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
    if (playerElement.value.currentTime < playerElement.value.duration * 0.1) {
        $trackEvent(player.currentTrackId, "skipped_on_start");
    } else if (playerElement.value.currentTime < playerElement.value.duration * 0.6) {
        $trackEvent(player.currentTrackId, "skipped_halfway");
    }
    let newIndex = player.currentTrackIndex + 1;
    if (newIndex >= player.queue.length) {
        newIndex = 0;
    }
    player.currentTrackIndex = newIndex;
    $trackEvent(player.currentTrackId, "started_auto");
}

function toggleTrackLooping() {
    player.loopOne = !player.loopOne;
    if (player.loopOne) {
        $trackEvent(player.currentTrackId, "set_looped");
    }
}

/**
 * --------------------------------------------------------
 * Event handlers
 * --------------------------------------------------------
 */

function onTrackEnded() {
    if (player.loopOne) {
        playerElement.value.play();
    } else {
        let newIndex = player.currentTrackIndex + 1;
        if (newIndex >= player.queue.length) {
            newIndex = 0;
        }
        player.currentTrackIndex = newIndex;
    }
}

onMounted(() => {
    playerTrackIntervalWatcherId = setInterval(() => {
        if (currentPlayerTrack.value && playerElement.value) {
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
    box-shadow: 0 -2px 10px rgba(var(--v-theme-accent));
}
</style>
