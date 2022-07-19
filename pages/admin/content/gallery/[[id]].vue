<template lang="pug">
v-progress-circular(v-if="!gallery", indeterminate)
v-container(v-else, fluid)
    div.d-flex.align-center.ma-4
        .text-h6 Editing gallery "{{ gallery.name }}" ({{ gallery.images.length }}
            v-icon(:icon="$ycIcon('photo')")
            | )
        v-spacer
        v-btn(@click="addImages()")
            v-icon(:icon="$ycIcon('add')")
            span Add images
        ui-form-field-image(ref="imageInput", v-show="false", :config="imageFieldConfig", name="", v-model="newImages")
    v-divider.mb-2
    v-pagination(v-model="page", v-if="pageCount > 1", :length="pageCount")
    v-row(no-gutters)
        v-col(cols="2", v-for="image in imagesForPage()")
            .d-flex.flex-column.ma-1
                v-img(v-if="image", cover, :elevation="8", :aspect-ratio="1", :src="$imageResize(image.file.id, 300)")
                    template(v-slot:placeholder)
                        div.d-flex.align-center.justify-center.fill-height
                            v-progress-circular(indeterminate)
                v-progress-circular(v-else, indeterminate)
                v-btn(:icon="$ycIcon('delete')", @click="removeImage(image)")
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
const pageSize = 24;
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
    globalLoader.showProgress("uploading images", newValue.length, uploadObservable);
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

/**
 * --------------------------------------------------------
 * Event handlers
 * --------------------------------------------------------
 */

// Functions that will run in response to component events
// that are not caused by the user directly

/**
 * --------------------------------------------------------
 * Exposed methods
 * --------------------------------------------------------
 */

// API methods and properties for the component that
// can be accessed from parent component
</script>
