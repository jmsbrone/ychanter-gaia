<template lang="pug">
include ../../../../templates/component-editable.pug

v-list
    v-list-item-group(v-for="(link, index) in options.links", :key="index")
        v-list-item-content
            NuxtLink(:to="`#`") {{ link.name }}
</template>

<script lang="ts">
import { Component } from "nuxt-property-decorator";
import { EditableComponentPrototype } from "../../../prototypes/editable-component-prototype";

@Component({})
export default class UiPcNavigationMenuEditable extends EditableComponentPrototype {}
</script>

<style lang="scss" src="./editor_styles.scss" scoped></style>
