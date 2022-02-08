<template lang="pug">
div(v-html="options.html")
</template>

<script lang="ts">
import { Component } from "nuxt-property-decorator";
import { ComponentPrototype } from "../../../prototypes/component-prototype";

@Component({})
export default class UiPcContentRawHtml extends ComponentPrototype {}
</script>

<style lang="scss" src="./styles.scss" scoped></style>
