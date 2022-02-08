import { ComponentConfig } from "client/types/editor";
import { FieldType } from "common/core/types/field-type-enum";

export const SectionMenuConfig: ComponentConfig = {
    name: "UiPcNavigationSectionMenu",
    options: {
        section: {
            type: FieldType.section,
            required: false,
        },
    },
    has_children: false,
    selector_text: "Section menu",
    editor_description: "This component displays all subsections of specified section",
};
