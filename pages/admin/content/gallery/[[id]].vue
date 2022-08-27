<template lang="pug">
v-progress-circular(v-if="!gallery", indeterminate)
.d-flex.flex-column.fill-height(v-else)
    .d-flex.flex-row.align-center.ma-4
        v-btn.mx-2(:icon="$ycIcon('back')", nuxt, to="/admin/content/galleries", color="secondary")
        .text-h6 Editing gallery "{{ gallery.name }}" ({{ gallery.images.length }}
            v-icon(:icon="$ycIcon('photo')")
            | )
        v-spacer
        v-btn(:icon="$ycIcon('small_image_size')", :class="{'bg-primary': selectedGridSize == 1}", @click="selectedGridSize = 1")
        v-btn(:icon="$ycIcon('normal_image_size')", :class="{'bg-primary': selectedGridSize == 2}", @click="selectedGridSize = 2")
        v-btn(:icon="$ycIcon('large_image_size')", :class="{'bg-primary': selectedGridSize == 3}", @click="selectedGridSize = 3")
        v-btn(@click="addImages()")
            v-icon(:icon="$ycIcon('add')")
            span Add images
        ui-form-field-image(ref="imageInput", v-show="false", :config="imageFieldConfig", name="", v-model="newImages")
    v-divider.mb-2
    v-pagination(v-model="page", v-if="pageCount > 1", :length="pageCount")
    .d-flex.flex-row.images-container.flex-wrap.fill-height(v-scroll.self="onScroll")
        v-col(:cols="selectedGridSize", v-for="image in imagesForPage()").pa-1
            v-hover(v-slot="{ isHovering, props }")
                .d-flex.flex-column(v-bind="props")
                    v-img(
                        v-if="image",
                        cover,
                        :elevation="8",
                        :aspect-ratio="1",
                        :src="$imageResize(image.file.id, 300)"
                    )
                        v-btn(v-show="isHovering" :icon="$ycIcon('delete')", @click="removeImage(image)").float-right
                        template(v-slot:placeholder)
                            div.d-flex.align-center.justify-center.fill-height
                                v-progress-circular(indeterminate)
                    v-progress-circular(v-else, indeterminate)
</template>

<script setup lang="ts">
import _ from "lodash";
import { Subject } from "rxjs";
import { DIContainer } from "../../../../core/port-manager";
import type { FormImageFieldConfig } from "../../../../core/types/editor";
import { FieldType } from "../../../../core/types/field-type-enum";
import type { GalleryAPI } from "../../../../modules/files/api";
import { FileService } from "../../../../modules/files/services/file-service";
import { Image } from "../../../../modules/files/types/image";

/**
 * --------------------------------------------------------
 * Component definitions
 * --------------------------------------------------------
 */

definePageMeta({
    layout: "admin",
    middleware: ["auth"],
});

/**
 * --------------------------------------------------------
 * General variables
 * --------------------------------------------------------
 */

const service = DIContainer.get<GalleryAPI>("GalleryAPI");
const pageSize = 96;
const imageFieldConfig = {
    type: FieldType.image,
    mimetyping: ["image/jpeg", "image/png"],
    multiple: true,
} as FormImageFieldConfig;

/**
 * --------------------------------------------------------
 * Template getters
 * --------------------------------------------------------
 */

function imagesForPage() {
    return _.filter(gallery.value.images, (_image, index: number) => {
        return index >= (page.value - 1) * pageSize && index < page.value * pageSize;
    });
}

/**
 * --------------------------------------------------------
 * Refs, states and watchers setup
 * --------------------------------------------------------
 */

const gallery = ref(await service.getById(parseInt(useRoute().params.id as string)));
gallery.value.images = await service.getImages(gallery.value.id);
const page = ref(1);
const pageCount = computed({
    get: () => Math.ceil(gallery.value.images.length / pageSize),
    set: () => {},
});
const imageInput = ref(null);
const newImages = ref([]);
const selectedGridSize = ref(2);

watch(page, async (newValue) => {
    const current_offset = (newValue - 1) * pageSize;
    if (!gallery.value.images[current_offset]) {
        const page_images = await service.getImages(gallery.value.id, pageSize, current_offset);
        gallery.value.images.splice(current_offset, pageSize, ...page_images);
    }
});

const globalLoader = useGlobalLoader();

watch(newImages, async (newValue) => {
    const fileService = new FileService();
    const uploadObservable = new Subject<number>();
    globalLoader.showProgress(`Uploading ${newValue.length} images`, newValue.length, uploadObservable);
    await Promise.all(
        _.map(newValue, async (file) => {
            const uploadData = await fileService.prepareUploadForFile(file);
            uploadData.upload_observer.subscribe({
                async next(file) {
                    if (file === null) {
                        return;
                    }
                    const image = new Image();
                    image.file = file;
                    image.id = file.id;
                    gallery.value.images.push(image);
                    service.addImages(gallery.value.id, [image.id]);
                },
            });
            uploadObservable.next(1);
            return fileService.startFileUpload(uploadData);
        })
    );
    globalLoader.close();
    pageCount.value = Math.ceil(gallery.value.images.length / pageSize);
});

/**
 * --------------------------------------------------------
 * User interaction handlers
 * --------------------------------------------------------
 */

function addImages() {
    imageInput.value.click();
}

async function removeImage(image: Image) {
    const gal = gallery.value;
    const index = _.indexOf(gal.images, image);
    await service.detachImages(gal.id, [gal.images[index].file.id]);
    gal.images.splice(index, 1);
    if (page.value >= pageCount.value) {
        page.value = pageCount.value;
    }
    if (page.value < 1) {
        page.value = 1;
    }
}

function onScroll(e) {
    const bottomScrollOffset = e.target.scrollHeight - (e.target.scrollTop + e.target.clientHeight);
    const maxScrollOffset = e.target.scrollHeight - e.target.clientHeight;
    const scrollPercentage = Math.round(100 * (1 - bottomScrollOffset / maxScrollOffset));
    console.log(scrollPercentage);
}

/**
 * --------------------------------------------------------
 * Exposed methods
 * --------------------------------------------------------
 */

// API methods and properties for the component that
// can be accessed from parent component
</script>

<style lang="scss" scoped>
.images-container {
    overflow-y: auto;
}
</style>
