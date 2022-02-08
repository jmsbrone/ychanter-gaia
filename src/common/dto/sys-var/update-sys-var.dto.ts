import { FieldType } from "common/core/types/field-type-enum";

export class UpdateSysVarDto {
    name: string;
    value: any;
    type: FieldType;
}
