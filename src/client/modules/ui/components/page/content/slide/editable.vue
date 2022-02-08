<template lang="pug">
include ../../../../templates/component-editable.pug

v-sheet(
    :class="{ 'edit-border-enabled': $store.state.editor.edit_border_on }",
    :style="{ height: options.height > 0 ? `${options.height}px` : 'auto' }"
)
    v-img.background-image-element(v-if="background_img_file", :src="`/${background_img_file.file.path}`")
    slot(name="controls")
    .d-flex.flex-column.content
        v-spacer
        div(v-html="options.content")
        v-spacer
</template>

<script lang="ts">
import { ImageService } from "client/modules/file/services/image-service";
import { File } from "client/modules/file/types/file";
import { Component, Watch } from "nuxt-property-decorator";
import { EditableComponentPrototype } from "../../../prototypes/editable-component-prototype";

@Component({})
export default class UiPcContentSlideEditable extends EditableComponentPrototype {
    background_img_file: File = null;

    async fetch() {
        await this.updateBackgroundImage();
    }

    @Watch("options.background_img")
    onBackgroundImageChanged() {
        this.updateBackgroundImage();
    }

    @Watch("options.height")
    onHeightChange() {}

    async updateBackgroundImage() {
        try {
            if (this.options.background_img) {
                const image_service = new ImageService();
                this.background_img_file = await image_service.getById(this.options.background_img);
            }
        } catch (error) {
            console.error(error);
        }
    }
}
</script>

<style lang="scss" src="./editor_styles.scss" scoped></style>
