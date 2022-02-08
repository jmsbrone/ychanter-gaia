import { ComponentConfig } from "client/types/editor";
import { FieldType } from "common/core/types/field-type-enum";

export const TextBlockConfig: ComponentConfig = {
    name: "UiPcContentTextBlock",
    options: {
        text: {
            type: FieldType.text,
            name: "Text",
        },
        color: {
            type: FieldType.color,
            name: "Color",
        },
    },
    has_children: false,
    selector_text: "Text",
    editor_description: "Text component allows to display text of selected color.",
};
