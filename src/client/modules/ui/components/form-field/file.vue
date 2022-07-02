<template lang="pug">
include ../../templates/file-field-input.pug

div
    div(v-if="config.preview")
        div(v-if="file")
            a(:href="`/${file.path}`", target="_blank") File link
        div(v-else)
            div No file selected
    +file-input
</template>

<script lang="ts">
import _ from "client/helpers/lodash";
import { FileService } from "client/modules/file/services/file-service";
import { FormFileFieldConfig } from "client/types/editor";
import { Component } from "nuxt-property-decorator";
import { FileBase } from "./file-base";

@Component({})
export default class FormFieldFile extends FileBase<FormFileFieldConfig> {
    async fetch() {
        if (!this.config.is_file_value && _.isNumber(this.value)) {
            const file_service = new FileService();
            this.file = await file_service.getById(this.value);
        }
    }
}
</script>
