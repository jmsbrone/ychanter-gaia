<template lang="pug">
include ../../../../modules/ui/templates/icons.pug

div(v-if="gallery")
    v-toolbar
        +icon_btn("back")(nuxt, to="/admin/content/galleries", title="Return")
        v-toolbar-title
            span.ma-1
                strong(v-if="gallery.name") {{ gallery.name }}
                span(v-else) #{ "<no name>" }
            span.ml-1 [ID: {{ gallery.id }}]
    v-sheet
        v-row(v-if="gallery.images && gallery.images.length > 0", no-gutters)
            v-col(cols="4", sm="4", md="3", lg="2", xl="1", v-for="(image, index) in imagesForPage", :key="index")
                v-img(v-if="image", :src="`/api/files/image/resize?id=${image.file.id}&width=300`", cover, aspect-ratio="1", max-height="300")
                v-progress-circular(v-else, indeterminate)
        div(v-else) Gallery is empty
    v-pagination(v-if="pageCount > 1", v-model="page", :length="pageCount")
</template>

<script lang="ts">
import _ from "client/helpers/lodash";
import { GalleryService } from "client/modules/file/services/gallery-service";
import { Gallery } from "client/modules/file/types/gallery";
import { Component, Vue, Watch } from "nuxt-property-decorator";

@Component({})
export default class AdminContentGalleryDetail extends Vue {
    gallery_id: number = null;
    gallery: Gallery = null;
    page_size: number = 27;
    page: number = 1;

    async asyncData({ params }) {
        return { gallery_id: parseInt(params.slug) };
    }

    async beforeMount() {
        switch (this.$vuetify.breakpoint.name) {
            case "lg":
                this.page_size = 54;
                break;
            case "xl":
                this.page_size = 108;
                break;
            default:
                this.page_size = 27;
                break;
        }
        await this.reloadGallery();
    }

    @Watch("page")
    async onPageChanged() {
        const gallery_service = new GalleryService();
        const current_offset = (this.page - 1) * this.page_size;
        if (!this.gallery.images[current_offset]) {
            const page_images = await gallery_service.getImages(this.gallery_id, this.page_size, current_offset);
            this.gallery.images.splice(current_offset, this.page_size, ...page_images);
        }
    }

    async reloadGallery() {
        const gallery_service = new GalleryService();
        if (this.gallery_id) {
            let gallery = await gallery_service.getById(this.gallery_id);
            gallery.images = await gallery_service.getImages(this.gallery_id, this.page_size);
            gallery.images.length = gallery.image_count;
            this.gallery = gallery;
        }
    }

    get pageCount() {
        return this.gallery.image_count ? Math.ceil(this.gallery.image_count / this.page_size) : 0;
    }

    get imagesForPage() {
        return _.filter(this.gallery.images, (_image, index: number) => {
            return index >= (this.page - 1) * this.page_size && index < this.page * this.page_size;
        });
    }
}
</script>
