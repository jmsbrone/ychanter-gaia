<template lang="pug">
include ../../../../templates/component-editable.pug

v-container.flex-column(fluid, :class="{ 'edit-border-enabled': $store.state.editor.edit_border_on }", no-gutters)
    slot(name="controls")
    v-row(v-if="images.length > 0")
        v-col(
            cols="2",
            v-for="(image, index) in images",
            :key="index",
            v-if="index >= (page - 1) * options.page_size && index < page * options.page_size"
        )
            v-img(:src="getImagePath(image)", :height="options.max_height")
    v-pagination(v-if="page_count > 1", v-model="page", :length="page_count")
</template>

<script lang="ts">
import { GalleryService } from "client/modules/file/services/gallery-service";
import { API_URL_PATH } from "common/constants";
import { Component, Watch } from "nuxt-property-decorator";
import { File } from "client/modules/file/types/file";
import { EditableComponentPrototype } from "../../../prototypes/editable-component-prototype";

@Component({})
export default class UiPcContentGalleryEditable extends EditableComponentPrototype {
    images: File[] = [];
    page: number = 1;

    get page_count() {
        return Math.ceil(this.images.length / this.options.page_size);
    }

    getImagePath(image) {
        return `${API_URL_PATH}/files/image/resize?id=${image.file.id}&height=${this.options.max_height * 1.5}`;
    }

    @Watch("options.gallery_id")
    @Watch("options_version")
    async onGalleryChanged() {
        await this.fetchGalleryImages();
    }

    @Watch("options.page_size")
    onPageSizeChanged() {
        this.page = 1;
    }

    @Watch("options.height")
    onHeightChanged() {}

    async fetchGalleryImages() {
        const gallery_id = this.options.gallery_id;
        if (!gallery_id) {
            return;
        }
        const gallery_service = new GalleryService();
        this.images = await gallery_service.getImages(this.options.gallery_id);
    }
}
</script>

<style lang="scss" src="./editor_styles.scss" scoped></style>
