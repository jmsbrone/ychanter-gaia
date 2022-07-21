<template lang="pug">
template(v-for="(block, index) in pageBlocks", :key="index")
    web-page-component-block(:name="block.name", :options="block.options")
</template>

<script setup lang="ts">
const props = defineProps(["page"]);
const pageBlocks = JSON.parse(props.page.content);
</script>
