<template lang="pug">
include ../../../../modules/ui/templates/icons.pug

div
    v-data-table(
        v-if="!$vuetify.breakpoint.mobile",
        :items="galleries",
        :headers="table_headers",
        :hide-default-footer="true",
        :page="gallery_page",
        :items-per-page="gallery_page_size"
    )
        template(v-slot:item.controls="{ item }")
            +icon_btn("list")(
                nuxt,
                :to="`/admin/content/galleries/${item.id}`"
            )
            +icon_btn("delete")(@click="deleteGallery(item)")
        template(v-slot:item.created_at="{ item }")
            span {{ formatDate(item.created_at) }}
    v-list(v-else)
        div(v-for="gallery in galleries", :key="gallery.id")
            v-list-item
                v-list-item-avatar
                    +icon("images")
                v-list-item-content {{ gallery.name || '&lt;no name&gt;' }} ({{ gallery.image_count }})
                v-list-item-action
                    +icon_btn_transparent("list")(
                        nuxt,
                        :to="`/admin/content/galleries/${gallery.id}`"
                    )
            v-divider
    v-pagination(
        v-if="galleryPageCount > 1",
        v-model="gallery_page",
        :length="galleryPageCount"
    )
</template>

<script lang="ts">
import { GalleryService } from "client/modules/file/services/gallery-service";
import { Gallery } from "client/modules/file/types/gallery";
import { DateFormatter } from "common/lib/date-formatter";
import { Component, Vue } from "nuxt-property-decorator";

@Component({})
export default class AdminContentGalleries extends Vue {
  galleries: Gallery[] = [];
  table_headers = [
    { text: "ID", value: "id", sortable: true },
    { text: "Created", value: "created_at", sortable: false },
    { text: "Name", value: "name", sortable: true },
    { text: "Images", value: "image_count", sortable: true },
    { text: "Controls", value: "controls", sortable: false },
  ];
  gallery_page: number = 1;
  gallery_page_size: number = 15;

  async fetch() {
    const gallery_service = new GalleryService();
    this.galleries = await gallery_service.getAll();
  }

  formatDate(date: string) {
    return DateFormatter.toShortLocalDateTime(date);
  }

  async deleteGallery(gallery: Gallery) {
    const gallery_service = new GalleryService();
    await gallery_service.delete({ id: gallery.id });
    this.galleries.splice(this.galleries.indexOf(gallery), 1);
  }

  get galleryPageCount() {
    return Math.ceil(this.galleries.length / this.gallery_page_size);
  }
}
</script>
