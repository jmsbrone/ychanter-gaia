import { ComponentConfig } from "client/types/editor";
import { FieldType } from "common/core/types/field-type-enum";

export const MenuConfig: ComponentConfig = {
    name: "UiPcNavigationMenu",
    options: {
        links: {
            type: FieldType.array,
            item_config: {
                type: FieldType.complex,
                sub_fields: {
                    url: {
                        type: FieldType.string,
                        maxlength: 255,
                        name: "URL",
                    },
                    name: {
                        type: FieldType.string,
                        maxlength: 255,
                        name: "Caption",
                    },
                },
            },
        },
    },
    has_children: false,
    selector_text: "Menu",
    editor_description:
        "Menu component allows to display a list of links to specified pages. Note that external links are not supported.",
};
