<template lang="pug">
v-container(fluid)
    .text-h4 General information about the system
    .text-subtitle-1 In development
</template>

<script setup lang="ts">
definePageMeta({
    layout: "admin",
    middleware: ["auth"],
});
</script>
