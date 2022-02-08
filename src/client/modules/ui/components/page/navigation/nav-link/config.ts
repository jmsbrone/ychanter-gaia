import { ComponentConfig } from "client/types/editor";
import { FieldType } from "common/core/types/field-type-enum";

export const NavLinkConfig: ComponentConfig = {
    name: "UiPcNavigationNavLink",
    options: {
        text: {
            type: FieldType.string,
            name: "Link caption",
        },
        url: {
            type: FieldType.string,
            name: "URL",
        },
    },
    has_children: false,
    selector_text: "Navigation link",
    editor_description: "Single component with a link to another page.",
};
