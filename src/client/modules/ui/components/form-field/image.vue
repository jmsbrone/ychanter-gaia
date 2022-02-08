<template lang="pug">
include ../../templates/file-field-input.pug

div
    v-row(v-if="config.preview", no-gutters)
        v-spacer
        v-col(:cols="preview_size_cols")
            template(v-if="file")
                template(v-if="config.preview_size === 'small'")
                    v-img(:src="`/${file.path}`", cover, width="60", height="60")
                template(v-else)
                    v-img(:src="`/${file.path}`", cover)
            div(v-else)
                div No image selected
        v-spacer
    +file-input(placeholder="Set new image", :prepend-icon="$ycIcon('add_image')")
</template>

<script lang="ts">
import _ from "client/helpers/lodash";
import { Component } from "nuxt-property-decorator";
import { FileBase } from "./file-base";
import { ImageService } from "client/modules/file/services/image-service";
import { FormImageFieldConfig } from "client/types/editor";

@Component({})
export default class FormFieldImage extends FileBase<FormImageFieldConfig> {
    get preview_size_cols() {
        switch (this.config.preview_size) {
            case "small":
                return 1;
            default:
                return 4;
        }
    }

    async fetch() {
        const image_service = new ImageService();
        if (!this.config.is_file_value && _.isNumber(this.value)) {
            this.file = ((await image_service.getById(this.value)) as any)?.file;
        } else if (this.config.is_file_value && _.isNumber(this.value?.id)) {
            const image = (await image_service.getById(this.value.id)) as any;
            if (image) {
                this.file = image.file;
            }
        }
    }
}
</script>
