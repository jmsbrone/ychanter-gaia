<template lang="pug">
include ../../templates/component.pug
div(
    :is="section_data.name",
    :options="section_data.options"
)
</template>

<script lang="ts">
import { Component, Prop, Vue } from "nuxt-property-decorator";

@Component({})
export default class extends Vue {
    @Prop()
    section_data: any;
}
</script>

<style lang="scss" src="./styles.scss" scoped></style>
