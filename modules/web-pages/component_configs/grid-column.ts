import { ComponentConfig, ComponentGroup } from "../../../core/types/editor";
import { FieldType } from "../../../core/types/field-type-enum";

export const GridColumnComponentConfig = {
    name: "web-pages:grid.column",
    selector_text: "Column",
    editor_description: "Vertical alignment of elements",
    group: ComponentGroup.Grid,
    has_children: true,
    options: {
        size_sm: {
            type: FieldType.number,
            name: "Size (mobile devices)",
            default: 12,
            min: 1,
            max: 12,
        },
        size_md: {
            type: FieldType.number,
            name: "Size (tablets and small monitors)",
            default: 6,
            min: 1,
            max: 12,
        },
        size_lg: {
            type: FieldType.number,
            name: "Size (average size monitor)",
            default: 4,
            min: 1,
            max: 12,
        },
        size_xl: {
            type: FieldType.number,
            name: "Size (large monitor)",
            default: 2,
            min: 1,
            max: 12,
        },
        size_xxl: {
            type: FieldType.number,
            name: "Size (extra large/wide monitors)",
            default: 1,
            min: 1,
            max: 12,
        },
    },
} as ComponentConfig;
