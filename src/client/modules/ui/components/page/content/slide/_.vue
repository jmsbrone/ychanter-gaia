<template lang="pug">
include ../../../../templates/component.pug

v-sheet(:style="{ height: options.height > 0 ? `${options.height}px` : 'auto' }")
    v-img.background-image-element(v-if="background_img_file", :src="`/${background_img_file.file.path}`")
    .d-flex.flex-column.content
        v-spacer
        div(v-html="options.content")
        v-spacer
</template>

<script lang="ts">
import { Component } from "nuxt-property-decorator";
import { ImageService } from "client/modules/file/services/image-service";
import { File } from "client/modules/file/types/file";
import { ComponentPrototype } from "../../../prototypes/component-prototype";
import { ClientStorage } from "client/core/components/storage/client-storage";
import _ from "client/helpers/lodash";

@Component({})
export default class UiPcContentSlide extends ComponentPrototype {
    background_img_file: File = null;

    /**
     * SSR loading
     */
    async serverPrefetch() {
        await this.updateBackgroundImage();
        ClientStorage.getInstance()
            .getStore()
            .setSsrResourceData("file", this.options.background_img, _.pick(this.background_img_file, ["file"]));
    }

    /**
     * Retrieving data if on client side
     */
    async beforeMount() {
        if (this.background_img_file) {
            return;
        }

        let stored_data: any = ClientStorage.getInstance()
            .getStore()
            .fetchSsrResourceData("file", this.options.background_img);
        if (!stored_data) {
            await this.updateBackgroundImage();
        } else {
            this.background_img_file = stored_data;
        }
    }

    /**
     * Retrieving background image data
     */
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

<style lang="scss" src="./styles.scss" scoped></style>
