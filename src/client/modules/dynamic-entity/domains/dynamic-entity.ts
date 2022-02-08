/**
 * @module Modules.DynamicEntity.Domains
 */

import { EntityFieldType } from "client/modules/dynamic-entity/types";

export class DynamicEntity {
    id: number = null;
    created_at: Date;
    updated_at: Date;
    title = "";
    name = "";
    table = "";
    fields: EntityFieldType[] = [];
}
