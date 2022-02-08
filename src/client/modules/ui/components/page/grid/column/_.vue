<template lang="pug">
include ../../../../templates/component.pug

v-col.flex-wrap(
    :cols="options.column_size",
    :sm="options.column_size_sm",
    :md="options.column_size_md",
    :lg="options.column_size_lg",
    :xl="options.column_size_xl"
)
    +component-list
</template>

<script lang="ts">
import { Component } from "nuxt-property-decorator";
import { ComponentPrototype } from "client/modules/ui/components/prototypes/component-prototype";

@Component({})
export default class UiPcGridColumn extends ComponentPrototype {}
</script>

<style lang="scss" src="./styles.scss" scoped></style>
