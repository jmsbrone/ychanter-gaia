import { ComponentConfig } from "client/types/editor";
import { FieldType } from "common/core/types/field-type-enum";

export const GridColumnConfig: ComponentConfig = {
    name: "UiPcGridColumn",
    options: {
        column_size: {
            type: FieldType.number,
            min: 1,
            max: 12,
            default: 12,
            name: "Column width (mobile, default)",
        },
        column_size_sm: {
            type: FieldType.number,
            min: 1,
            max: 12,
            default: 6,
            name: "Column size (tablet)",
        },
        column_size_md: {
            type: FieldType.number,
            min: 1,
            max: 12,
            default: 4,
            name: "Column size (laptop)",
        },
        column_size_lg: {
            type: FieldType.number,
            min: 1,
            max: 12,
            default: 4,
            name: "Column size (desktop)",
        },
        column_size_xl: {
            type: FieldType.number,
            min: 1,
            max: 12,
            default: 3,
            name: "Column size (large desktop)",
        },
    },
    has_children: true,
    selector_text: "Column",
    editor_description: "Grid column block",
};
