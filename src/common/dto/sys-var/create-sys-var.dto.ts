import { FieldType } from "common/core/types/field-type-enum";

export class CreateSysVarDto {
    name: string;
    type: FieldType;
    value: any;
}
