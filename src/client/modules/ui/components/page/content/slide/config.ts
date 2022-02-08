import { ComponentConfig } from "client/types/editor";
import { FileType } from "common/file-types";
import { FieldType } from "common/core/types/field-type-enum";

export const SlideConfig: ComponentConfig = {
    name: "UiPcContentSlide",
    options: {
        background_img: {
            type: FieldType.image,
            preview: true,
            name: "Background image",
            upload_type: FileType.Image,
        },
        content: {
            type: FieldType.wysiwyg,
            name: "Slide content",
        },
        height: {
            type: FieldType.number,
            default: 200,
            min: 100,
            name: "Slide height, px",
        },
    },
    has_children: false,
    selector_text: "Picture slide with text",
    editor_description:
        "Slide component allows to display a background picture with some wysiwyg content in the middle (vertically).",
};
