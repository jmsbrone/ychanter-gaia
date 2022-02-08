<template lang="pug">
v-container.flex-column(fluid, :class="{ 'edit-border-enabled': $store.state.editor.edit_border_on }", no-gutters)
</template>

<script lang="ts">
import { EditableComponentPrototype } from "client/modules/ui/components/prototypes/editable-component-prototype";
import { Component } from "nuxt-property-decorator";

@Component({})
export default class extends EditableComponentPrototype {}
</script>

<style lang="scss" src="./editor_styles.scss" scoped></style>
