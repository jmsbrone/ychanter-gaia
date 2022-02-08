<template lang="pug">
include ../../templates/icons.pug

div
    v-row.align-center(no-gutters)
        v-col(:cols="gallery && gallery.id ? '10' : '11'")
            FormFieldAutocomplete(
                :config="gallery_name_field_config",
                v-model="gallery",
                :search-value="tmp_gallery.name",
                @update:search-value="onGalleryNameUpdate($event)"
            )
        v-col(cols="2", v-if="gallery && gallery.id > 0")
            v-row(align="center", justify="end", no-gutters)
                +icon_btn('add_image')(@click="clickFileInput()", :disabled="isActiveUpload()")
                +icon_btn('delete-sweep')(
                    :disabled="(images && images.length == 0) || isActiveUpload()",
                    @click="clearGallery()"
                )

        v-col(cols="1", v-else)
            v-row(no-gutters)
                +icon_btn('confirm')(
                    :disabled="tmp_gallery.name && tmp_gallery.name.length === 0",
                    @click="createGallery()"
                )

    v-row(no-gutters, v-if="upload_data")
        v-progress-linear(
            :value="(upload_data.upload_progress.uploaded_chunks / upload_data.upload_progress.total_chunks) * 100"
        )

    v-row(no-gutters, v-if="images.length > 0")
        v-col(
            cols="2",
            v-for="(image, index) in images",
            :key="index",
            v-if="index >= (page - 1) * page_size && index < page * page_size"
        )
            v-img(max-height="400", :src="`/api/images/${image.file.id}?width=200`", cover, aspect-ratio="1")
                +icon_btn("delete")(@click="removeImage(index)")
    v-pagination(v-if="images && images.length > page_size", v-model="page", :length="page_count")
    div(v-show="false")
        FormFieldImage(
            :config="field_config",
            v-model="files",
            ref="image_field",
            @upload_start="onUploadStart",
            @upload_end="onUploadEnd"
        )
</template>

<script lang="ts">
import _ from "client/helpers/lodash";
import { GalleryService } from "client/modules/file/services/gallery-service";
import { FormAutocompleteFieldConfig, FormHiddenFieldConfig, FormImageFieldConfig } from "client/types/editor";
import { FileType } from "common/file-types";
import { FieldType } from "common/core/types/field-type-enum";
import { Component, Watch } from "nuxt-property-decorator";
import { FormFieldBase } from "./base";
import { Gallery } from "client/modules/file/types/gallery";

@Component({})
export default class FormFieldGallery extends FormFieldBase<FormImageFieldConfig> {
    field_config: FormImageFieldConfig = {
        type: FieldType.image,
        multiple: true,
        name: "Upload images to gallery",
        upload_type: FileType.Image,
        is_file_value: true,
        mimetyping: ["image/jpeg", "image/png"],
    };
    gallery_name_field_config: FormAutocompleteFieldConfig = {
        type: FieldType.autocomplete,
        required: this.config.required,
        name: "Name",
        maxlength: 60,
        items: [],
        text_prop: "name",
        value_prop: "name",
        object_return: true,
        filter: false,
        custom_validator: this.isGallerySelected.bind(this),
    };
    gallery_name_confirmed_config: FormHiddenFieldConfig = {
        type: FieldType.hidden,
        required: true,
    };
    images: any[] = [];
    files: any = [];
    gallery: Gallery = new Gallery();
    tmp_gallery: Gallery = new Gallery();
    page: number = 1;
    page_size: number = 12;
    upload_data = null;
    gallery_name_confirmed: string = null;
    gallery_service = new GalleryService();

    /**
     * Called when input value changes, i.e. when user selects more images
     */
    @Watch("files")
    async onFilesChanges() {
        if (!this.files) {
            return;
        }

        const images_ids = _.map(this.files, "id");
        await this.gallery_service.addImages(this.gallery.id, images_ids);
        await this.updateImages();
    }

    @Watch("gallery")
    onGalleryNameChangedHandler = _.debounce(this.onGalleryChanged.bind(this), 500);
    async onGalleryChanged() {
        this.emitModelUpdate();
        await this.updateImages();
    }

    /**
     * Number of pages for current image array
     */
    get page_count() {
        return Math.ceil(this.images.length / this.page_size);
    }

    getModelValue() {
        return this.gallery?.id;
    }

    async fetch() {
        this.tmp_gallery.name = "";

        if (this.model_value) {
            this.gallery = await this.gallery_service.getById(this.model_value);
            this.tmp_gallery.name = this.gallery.name;
        } else {
            this.gallery = this.tmp_gallery;
        }
        await this.updateImages();
        if (this.gallery_name_field_config.items.length === 0) {
            this.gallery_name_field_config.items.push(this.tmp_gallery);
        }
    }

    /**
     * Updates current gallery images
     */
    async updateImages() {
        if (this.gallery && this.gallery.id) {
            this.images = await this.gallery_service.getImages(this.gallery.id);
        }
    }

    /**
     * Receive upload data
     */
    onUploadStart(upload_data) {
        this.upload_data = upload_data;
    }

    /**
     * Handler for upload finish
     */
    onUploadEnd() {
        this.upload_data = null;
    }

    /**
     * Removes image from gallery. Does not delete.
     */
    async removeImage(index: number) {
        await this.gallery_service.detachImages(this.gallery.id, [this.images[index].file.id]);
        this.images.splice(index, 1);
        if (this.page >= this.page_count) {
            this.page = this.page_count;
        }
        if (this.page < 1) {
            this.page = 1;
        }
    }

    /**
     * Removes all images from gallery
     */
    async clearGallery() {
        if (!this.gallery) {
            return;
        }
        await this.gallery_service.clearGallery(this.gallery.id);
        this.images = [];
        this.page = 1;
    }

    /**
     * Wrapper function to call hidden image field
     */
    clickFileInput() {
        (this.$refs.image_field as any).click();
    }

    /**
     * Helper function to display percentage with precision
     */
    roundPercentage(value) {
        return Math.round(value * 100) / 100;
    }

    /**
     * Creates new gallery with current name
     */
    async createGallery() {
        this.gallery = await this.gallery_service.create(this.tmp_gallery.name);
    }

    /**
     * Handler for gallery name change
     */
    async onGalleryNameUpdate(name: string) {
        if (!name || (this.gallery && this.gallery.name === name)) {
            return;
        }
        this.tmp_gallery.name = name;

        const galleries = await this.gallery_service.findByName(`${name}%`);
        _.sort(galleries, (gallery) => gallery.name.length);
        if (galleries.length > 0 && galleries[0].name === name) {
            (this.tmp_gallery as any).header = "Gallery with this name already exists, click to select it.";
        } else {
            if (galleries.length === 0) {
                (this.tmp_gallery as any).header = "No galleries found. New gallery will be created with this name.";
            } else {
                (this.tmp_gallery as any).header = "Create new gallery or find existing one";
            }
            this.gallery = this.tmp_gallery;
            this.images = [];
        }
        this.gallery_name_field_config.items = [this.tmp_gallery];
        this.gallery_name_field_config.items.push(...galleries);
    }

    /**
     * Custom validator for autocomplete field
     */
    isGallerySelected(value: Gallery) {
        return (value && value.id > 0) || "Gallery not selected";
    }

    /**
     * Returns true if there is an active upload in progress
     */
    isActiveUpload(): boolean {
        return this.upload_data != null;
    }
}
</script>
