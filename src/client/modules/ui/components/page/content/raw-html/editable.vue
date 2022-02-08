<template lang="pug">
v-row(:class="{ 'edit-border-enabled': $store.state.editor.edit_border_on }", no-gutters)
    div(v-html="options.html")
    slot(name="controls")
</template>

<script lang="ts">
import { Component } from "nuxt-property-decorator";
import { EditableComponentPrototype } from "../../../prototypes/editable-component-prototype";

@Component({})
export default class UiPcContentRawHtmlEditable extends EditableComponentPrototype {}
</script>

<style lang="scss" src="./editor_styles.scss" scoped></style>
