import { ComponentConfig, ComponentGroup } from "../../../core/types/editor";
import { FieldType } from "../../../core/types/field-type-enum";

export const ContentTextComponentConfig = {
    name: "web-page:content.text",
    editor_description: "Simple text block",
    selector_text: "Text",
    has_children: false,
    options: {
        text: {
            name: "text",
            type: FieldType.string,
            required: true,
            default: "text here...",
        },
    },
    group: ComponentGroup.Content,
} as ComponentConfig;
