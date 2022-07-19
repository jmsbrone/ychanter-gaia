<template lang="pug">
v-card(flat)
    v-card-title Web page editor [{{ page.name }}]
    v-card-text
        v-form(ref="form")
            v-row
                v-col(cols=12)
                    v-text-field(label="Name", v-model="formData.name", :rules="formRules.name")
                v-col(cols=12, v-if="formData.system")
                    v-text-field(label="Path", v-model="formData.path", :rules="formRules.path")
                v-col(cols=12, v-if="!formData.system")
                    v-text-field(label="Alias", v-model="formData.alias", :rules="formRules.alias")
                v-col(cols=12)
                    v-switch(label="System page", color="primary", v-model="formData.system")
    v-card-actions
        v-btn(color="primary", @click="savePage()") Save
</template>

<script setup lang="ts">
import _ from "lodash";
import { DIContainer } from "../../core/port-manager";
import type { AppNotification } from "../../core/types/app";
import type { WebPagesAPI } from "../../modules/web-pages/api";

/**
 * --------------------------------------------------------
 * Component definitions
 * --------------------------------------------------------
 */

const props = defineProps<{
    id: number;
}>();

/**
 * --------------------------------------------------------
 * General variables
 * --------------------------------------------------------
 */

const service = DIContainer.get<WebPagesAPI>("WebPagesAPI");
const formRules = {
    name: [(value) => !!value || "Name is required"],
    path: [(value) => !formData.system || (formData.system && !!value) || "Path is required"],
    alias: [(value) => (!formData.system && !!value) || "Alias is required"],
};

/**
 * --------------------------------------------------------
 * Refs, states and watchers setup
 * --------------------------------------------------------
 */

const page = ref(await service.getById(props.id));
const formData = reactive({
    id: page.value.id,
    name: page.value.name,
    alias: page.value.alias,
    system: page.value.system,
    path: page.value.path,
});
const form = ref(null);
const notification = useState<AppNotification>("notification");

/**
 * --------------------------------------------------------
 * User interaction handlers
 * --------------------------------------------------------
 */

async function savePage() {
    const validationResult = await form.value.validate();
    if (!validationResult.valid) {
        notification.value.open = true;
        notification.value.type = "error";
        notification.value.text = "Please fill out the form correctly";
        return;
    }
    const result = await service.save(formData);
    if (result) {
        notification.value.open = true;
        notification.value.type = "success";
        notification.value.text = "Saved";
    }
}
</script>
