import { ComponentConfig } from "client/types/editor";
import { FieldType } from "common/core/types/field-type-enum";

export const RawHtmlConfig: ComponentConfig = {
    name: "UiPcContentRawHtml",
    options: {
        html: {
            type: FieldType.wysiwyg,
        },
    },
    has_children: false,
    selector_text: "Wysiwyg editor",
    editor_description: `Wysiwyg component allows to include any HTML content.
        Should only be used to provide some additional content.
        Using it to include pre-generated blocks from external sources with external styles can have unexpected results.`,
};
