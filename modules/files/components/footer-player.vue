<template lang="pug">
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
import { useMediaPlayerStore } from "../stores/player";
import { AudioFile } from "../types/audio-file";

/**
 * --------------------------------------------------------
 * General variables
 * --------------------------------------------------------
 */

const { $audioLink } = useNuxtApp();
let { $trackEvent } = useNuxtApp();
if (typeof $trackEvent === "undefined") {
    $trackEvent = () => {};
}

let playerTrackIntervalWatcherId = null;
const playerElement: Ref<HTMLAudioElement> = ref(null);
const currentPlayerTrack: Ref<AudioFile> = ref(null);
const currentTrackTime: Ref<number> = ref(0);
const currentTrackDuration: Ref<number> = ref(1);
const player = useMediaPlayerStore();
const notification = useAppNotification();

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
