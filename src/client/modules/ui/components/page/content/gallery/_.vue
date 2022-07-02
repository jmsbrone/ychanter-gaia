<template lang="pug">
include ../../../../templates/component.pug

client-only
    v-container.flex-column(fluid)
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
import { Component } from "nuxt-property-decorator";
import _ from "client/helpers/lodash";
import { GalleryService } from "client/modules/file/services/gallery-service";
import { API_URL_PATH } from "common/constants";
import { File } from "client/modules/file/types/file";
import { ComponentPrototype } from "../../../prototypes/component-prototype";
import { ClientStorage } from "client/core/components/storage/client-storage";

@Component({})
export default class UiPcContentGallery extends ComponentPrototype {
    images: File[] = [];

    page: number = 1;
    get page_count() {
        return Math.ceil(this.images.length / this.options.page_size) || 10;
    }

    getImagePath(image) {
        return `${API_URL_PATH}/files/image/resize?id=${image.file.id}&height=${this.options.max_height * 1.5}`;
    }

    /**
     * SSR loading
     */
    async serverPrefetch() {
        await this.fetchGalleryImages();
        ClientStorage.getInstance().getStore().setSsrResourceData("gallery", this.options.gallery_id, this.images);
    }

    /**
     * Retrieving data if on client side
     */
    async beforeMount() {
        const gallery_id = this.options.gallery_id;
        if (!gallery_id) {
            return;
        }

        let stored_data: any = ClientStorage.getInstance()
            .getStore()
            .fetchSsrResourceData("gallery", this.options.gallery_id);
        if (!stored_data) {
            await this.fetchGalleryImages();
        } else {
            this.images = stored_data;
        }
    }

    async fetchGalleryImages() {
        if (this.options.gallery_id) {
            const gallery_service = new GalleryService();
            this.images = await gallery_service.getImages(this.options.gallery_id);
        }
    }
}
</script>

<style lang="scss" src="./styles.scss" scoped></style>
