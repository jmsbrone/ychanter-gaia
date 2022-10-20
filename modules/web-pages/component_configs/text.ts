import { ComponentConfig, ComponentGroup } from "../../../core/types/editor";
import { FieldType } from "../../../core/types/field-type-enum";

export const ContentTextComponentConfig = {
    name: "web-pages:content.text",
    editor_description: "Simple text block",
    selector_text: "Text",
    has_children: false,
    options: {
        text: {
            name: "Text",
            type: FieldType.string,
            required: true,
            default: "text here...",
        },
        style: {
            name: "Text style",
            type: FieldType.select,
            required: true,
            default: "default",
            options: {
                default: "Default",
                "weight-black": "Black",
                "weight-bold": "Bold",
                "weight-medium": "Medium bold",
                "weight-light": "Light",
                "weight-thin": "Thin",
                italic: "Italic",
            },
        },
        size: {
            name: "Text size",
            type: FieldType.select,
            required: true,
            default: "default",
            options: {
                default: "Default",
                h1: "Heading 1",
                h2: "Heading 2",
                h3: "Heading 3",
                h4: "Heading 4",
                h5: "Heading 5",
                h6: "Heading 6",
                "subtitle-1": "Subtitle 1",
                "subtitle-2": "Subtitle 2",
                "body-1": "Body 1",
                "body-2": "Body 2",
                caption: "caption",
            },
        },
        alignment: {
            name: "Text alignment",
            type: FieldType.select,
            required: true,
            default: "left",
            options: {
                left: "Left",
                right: "Right",
                center: "Center",
                justify: "Justify",
            },
        },
    },
    group: ComponentGroup.Content,
} as ComponentConfig;
