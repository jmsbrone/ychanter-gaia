<template lang="pug">
include ../../../../templates/component.pug

v-list
    v-list-item-group(v-for="(link, index) in options.links", :key="index")
        v-list-item-content
            NuxtLink(:to="link.url") {{ link.name }}
</template>

<script lang="ts">
import { Component } from "nuxt-property-decorator";
import { ComponentPrototype } from "../../../prototypes/component-prototype";

@Component({})
export default class UiPcNavigationMenu extends ComponentPrototype {}
</script>

<style lang="scss" src="./styles.scss" scoped></style>
