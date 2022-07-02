import { Component } from "nuxt-property-decorator";
import { FormFieldBase } from "./base";
import { File as FileModel } from "../../../file/types/file";
import { FileService, FileUploadInfo } from "client/modules/file/services/file-service";
import _ from "client/helpers/lodash";
import { FormAudioFieldConfig, FormFileFieldConfig, FormImageFieldConfig } from "client/types/editor";

@Component({})
export class FileBase<T extends FormImageFieldConfig | FormFileFieldConfig | FormAudioFieldConfig> extends FormFieldBase<T> {
    file: FileModel | FileModel[] = null;
    uploading = false;
    upload_progress = {
        total_chunks: 0,
        uploaded_chunks: 0,
        total_files: 0,
        uploaded_files: 0,
        total_bytes: 0,
        uploaded_bytes: 0,
        active: false,
    };
    upload_chunk_count = 0;
    uploaded_chunks = 0;
    file_uploads: FileUploadInfo[] = [];

    init() {
        if (this.config.is_file_value) {
            this.file = this.value;
        }
        this.model_value = null;
    }

    onValueChanged() {
        // Do nothing for file fields. Read-only.
    }

    resetUploadProgress() {
        this.upload_progress = {
            total_chunks: 0,
            uploaded_chunks: 0,
            total_files: 0,
            uploaded_files: 0,
            total_bytes: 0,
            uploaded_bytes: 0,
            active: false,
        };
    }

    async onValueChangedHandlerDebounced() {
        if (!this.model_value) {
            return;
        }

        if (!(this.$refs["input"] as any).validate()) {
            return;
        }

        this.uploading = true;
        this.uploaded_chunks = 0;

        try {
            const file_service = new FileService();
            const files: File[] = this.config.multiple ? this.model_value : [this.model_value];
            this.file_uploads = [];
            this.resetUploadProgress();
            for (let i = 0; i < files.length; ++i) {
                const file = files[i];
                const file_upload = await file_service.prepareUploadForFile(file, this.config.upload_type);
                this.file_uploads.push(file_upload);

                this.upload_progress.total_bytes += file_upload.bytes;
                this.upload_progress.total_chunks += file_upload.chunks;
                file_upload.upload_observer.subscribe({
                    next: (created_file) => {
                        this.upload_progress.uploaded_bytes += file_upload.chunk_size;
                        this.upload_progress.uploaded_chunks++;
                        this.$emit("upload_progress", {
                            file_uploads: this.file_uploads,
                            upload_progress: this.upload_progress,
                        });
                    },
                });
            }
            this.upload_progress.total_files = files.length;

            this.$emit("upload_start", {
                file_uploads: this.file_uploads,
                upload_progress: this.upload_progress,
            });

            const uploaded_files = [];
            for (let i = 0; i < this.file_uploads.length; ++i) {
                uploaded_files.push(await file_service.startFileUpload(this.file_uploads[i]));
                this.upload_progress.uploaded_files++;
            }

            if (this.config.multiple) {
                this.file = uploaded_files;
            } else {
                this.file = uploaded_files[0];
            }
            this.resetUploadProgress();
            this.$emit("upload_end");

            this.emitModelUpdate();
        } catch (error) {
            this.file = null;
            console.error(error);
        }
        this.uploading = false;
    }

    getModelValue() {
        if (this.config.is_file_value) {
            return this.file;
        } else {
            if (this.config.multiple) {
                return _.map(this.file as FileModel[], "id");
            } else {
                return (this.file as FileModel)?.id;
            }
        }
    }

    click() {
        (this.$refs.input as any).$refs.input.click();
    }
}
