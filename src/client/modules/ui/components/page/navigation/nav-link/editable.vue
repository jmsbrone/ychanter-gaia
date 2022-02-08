<template lang="pug">
include ../../../../templates/component-editable.pug

a(href="#") {{ options.text }}
</template>

<script lang="ts">
import { Component } from "nuxt-property-decorator";
import { EditableComponentPrototype } from "../../../prototypes/editable-component-prototype";

@Component({})
export default class extends EditableComponentPrototype {}
</script>

<style lang="scss" src="./editor_styles.scss" scoped></style>
