import { FieldType } from "common/core/types/field-type-enum";

/**
 * Dynamic entity field definition class.
 */
export class EntityFieldType {
    /**
     * Field type
     */
    type: FieldType;
    /**
     * Field name
     */
    name: string;
    /**
     * Field title
     */
    title?: string;
    /**
     * Field title in forms (if displayed)
     */
    form_title?: string;
    /**
     * Field is required for entities
     */
    required?: boolean;
    /**
     * Whether its one-to-many or many-to-many
     */
    multivalued?: boolean;
    /**
     * Field values it unique for the entity
     */
    unique?: boolean;
    /**
     * Default value for the field. When adding the field it will be added
     * to all existing entities.
     */
    default?: any;
    /**
     * System field flag. System fields are used internally by the application
     * and should not be modified.
     */
    system?: boolean;
    /**
     * Field validators
     */
    validator_rules?: string[];
    /**
     * Field length. Value should depend on whatever type is used
     */
    length?: number;
    /**
     * Field value that will be set if entity record changes
     */
    value_on_update?: string;
    /**
     * Fields defines a link to another entity (entity name)
     */
    link_to_entity?: string;
    /**
     * Contains old name for this field if it was renamed
     */
    old_name?: string;
    /**
     * Field is locked and cannot be changed
     */
    readonly locked?: boolean;
    /**
     * Last field update resulted in an error
     */
    readonly update_error?: boolean;
}
