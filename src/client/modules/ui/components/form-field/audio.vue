<template lang="pug">
include ../../templates/file-field-input.pug

div
    +file-input(
        placeholder="Add audio file",
        :prepend-icon="$ycIcon('add-audio-file')"
    )
</template>

<script lang="ts">
import _ from "client/helpers/lodash";
import { Component } from "nuxt-property-decorator";
import { FileBase } from "./file-base";
import { AudioFileService } from "client/modules/file/services/audio-service";
import { FormAudioFieldConfig } from "client/types/editor";

@Component({})
export default class FormFieldAudio extends FileBase<FormAudioFieldConfig> {
  async fetch() {
    const image_service = new AudioFileService();
    if (!this.config.is_file_value && _.isNumber(this.value)) {
      this.file = ((await image_service.getById(this.value)) as any)?.file;
    } else if (this.config.is_file_value && _.isNumber(this.value?.id)) {
      const audioFile = (await image_service.getById(this.value.id)) as any;
      if (audioFile) {
        this.file = audioFile.file;
      }
    }
  }
}
</script>
