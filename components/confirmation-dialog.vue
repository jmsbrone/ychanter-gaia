<template lang="pug">
v-dialog(v-model="dialogOpened", persistent)
    v-card.pa-4
        v-card-title {{ props.title }}
        v-card-text {{ props.text }}
        v-card-actions
            v-spacer
            v-btn(color="primary", @click="confirm()") Yes
            v-btn(color="secondary", @click="cancel()") No
            v-spacer
</template>

<script setup lang="ts">
/**
 * --------------------------------------------------------
 * Component definitions
 * --------------------------------------------------------
 */

const props = defineProps<{
    title: string;
    text: string;
}>();
const emit = defineEmits(["confirm", "cancel"]);

/**
 * --------------------------------------------------------
 * General variables
 * --------------------------------------------------------
 */

const dialogOpened = true;

/**
 * --------------------------------------------------------
 * User interaction handlers
 * --------------------------------------------------------
 */

function confirm() {
    emit("confirm");
}
function cancel() {
    emit("cancel");
}
</script>
