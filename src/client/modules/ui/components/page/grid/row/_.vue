<template lang="pug">
include ../../../../templates/component.pug

v-row(no-gutters)
    +component-list
</template>

<script lang="ts">
import { Component } from "nuxt-property-decorator";
import { ComponentPrototype } from "client/modules/ui/components/prototypes/component-prototype";

@Component({})
export default class UiPcGridRow extends ComponentPrototype {}
</script>

<style lang="scss" src="./styles.scss" scoped></style>
