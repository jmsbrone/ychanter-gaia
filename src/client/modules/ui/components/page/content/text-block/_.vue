<template lang="pug">
include ../../../../templates/component.pug

div(:style="{ color: options.color }") {{ options.text }}
</template>

<script lang="ts">
import { Component } from "nuxt-property-decorator";
import { ComponentPrototype } from "../../../prototypes/component-prototype";

@Component({})
export default class UiPcContentTextBlock extends ComponentPrototype {}
</script>

<style lang="scss" src="./styles.scss" scoped></style>
