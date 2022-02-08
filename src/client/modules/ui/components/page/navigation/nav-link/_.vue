<template lang="pug">
include ../../../../templates/component.pug

NuxtLink(v-if="options && options.url", :to="options.url") {{ options.text }}
</template>

<script lang="ts">
import { Component } from "nuxt-property-decorator";
import { ComponentPrototype } from "../../../prototypes/component-prototype";

@Component({})
export default class UiPcNavigationNavLink extends ComponentPrototype {}
</script>

<style lang="scss" src="./styles.scss" scoped></style>
