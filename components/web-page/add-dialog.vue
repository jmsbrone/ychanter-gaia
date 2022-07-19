<template lang="pug">
v-dialog(v-model="dialogOpen", persistent)
    v-card.py-6
        v-card-title.text-center
            span.text-h5 Add new page
        v-card-text
            v-container
                v-row
                    v-col(cols="12")
                        .text-body-1 Enter title for the new page
                        v-text-field(
                            name="name",
                            label="Name",
                            v-model="formData.name"
                        )
                    v-col(cols="12")
                        .text-body-1 Enter desired page url (optional)
                        v-text-field(
                            name="alias",
                            label="URL",
                            v-model="formData.alias"
                        )
                        .text-subtitle-1(v-show="formData.alias")
                            | New page path will be {{ parentPage?.path }}{{ formData.alias }}/
        v-card-actions
            v-spacer
            v-btn(@click="confirm()", color="primary") Save
            v-btn(@click="cancel()", color="secondary") Close
            v-spacer
</template>

<script setup lang="ts">
import { DIContainer } from "../../core/port-manager";
import type { WebPagesAPI } from "../../modules/web-pages/api";
import { CreateWebPageDto } from "../../modules/web-pages/dto/web-page-dto";

/**
 * --------------------------------------------------------
 * Component definitions
 * --------------------------------------------------------
 */

const props = defineProps(["parentPage", "opened"]);
const emit = defineEmits(["added", "canceled", "update:opened"]);

/**
 * --------------------------------------------------------
 * Refs, states and watchers setup
 * --------------------------------------------------------
 */

const formData = reactive({
    name: "",
    alias: "",
});
const dialogOpen = ref(props.opened);
watch(
    () => props.opened,
    (value) => {
        dialogOpen.value = value;
    }
);
watch(dialogOpen, function (newValue) {
    emit("update:opened", newValue);
});

/**
 * --------------------------------------------------------
 * User interaction handlers
 * --------------------------------------------------------
 */

async function confirm() {
    const service = DIContainer.get<WebPagesAPI>("WebPagesAPI");
    const createdWebPage = await service.save({
        name: formData.name,
        alias: formData.alias,
        parent: props.parentPage?.id,
    } as CreateWebPageDto);
    emit("added", createdWebPage);
    dialogOpen.value = false;
}
function cancel() {
    dialogOpen.value = false;
    emit("canceled", true);
}
</script>
