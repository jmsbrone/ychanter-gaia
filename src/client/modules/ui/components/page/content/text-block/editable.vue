<template lang="pug">
include ../../../../templates/component-editable.pug

div(:class="{ 'edit-border-enabled': $store.state.editor.edit_border_on }")
    div(:style="{ color: options.color }") {{ options.text }}
    slot(name="controls")
</template>

<script lang="ts">
import { Component } from "nuxt-property-decorator";
import { EditableComponentPrototype } from "../../../prototypes/editable-component-prototype";

@Component({})
export default class UiPcContentTextBlockEditable extends EditableComponentPrototype {}
</script>

<style lang="scss" src="./editor_styles.scss" scoped></style>
