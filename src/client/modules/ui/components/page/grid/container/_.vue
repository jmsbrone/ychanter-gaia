<template lang="pug">
include ../../../../templates/component.pug

v-container.flex-wrap
    +component-list
</template>

<script lang="ts">
import { Component } from "nuxt-property-decorator";
import { DraggableComponent } from "client/mixins/draggable-component";
import { ComponentPrototype } from "../../../prototypes/component-prototype";

@Component({
    mixins: [DraggableComponent],
})
export default class UiPcGridContainer extends ComponentPrototype {}
</script>

<style lang="scss" src="./styles.scss" scoped></style>
