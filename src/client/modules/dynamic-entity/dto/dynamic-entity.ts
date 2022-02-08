import { EntityFieldType } from "client/modules/dynamic-entity/types";

export class CreateDynamicEntityDto {
    name: string;
    title: string;
    fields: EntityFieldType[];
}

export class UpdateDynamicEntityDto {
    id: number;
    name?: string;
    title?: string;
    fields?: EntityFieldType[];
}

export class DeleteDynamicEntityDto {
    id: number;
}
