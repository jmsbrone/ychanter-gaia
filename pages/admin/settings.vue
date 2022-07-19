<template lang="pug">
v-container(fluid)
    .text-h4 System settings
    .text-subtitle-1 Configuration options for different parts of the system
</template>

<script setup lang="ts">
definePageMeta({
    layout: "admin",
    middleware: ["auth"],
});
</script>
