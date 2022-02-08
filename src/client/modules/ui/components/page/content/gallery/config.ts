import { ComponentConfig } from "client/types/editor";
import { FieldType } from "common/core/types/field-type-enum";

export const GalleryConfig: ComponentConfig = {
    name: "UiPcContentGallery",
    options: {
        gallery_id: {
            type: FieldType.gallery,
            name: "Gallery",
            required: true,
        },
        page_size: {
            type: FieldType.number,
            name: "Page size",
            required: true,
            default: 12,
            min: 1,
        },
        max_height: {
            type: FieldType.number,
            name: "Image height (px)",
            required: true,
            default: 300,
            min: 200,
            max: 1000,
        },
    },
    has_children: false,
    selector_text: "Gallery of images",
    editor_description: "Gallery for displaying multiple pictures",
};
