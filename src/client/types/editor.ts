import { FieldType } from "common/core/types/field-type-enum";

export const FormFieldTypeNameMap = {
    [FieldType.string]: "String",
    [FieldType.number]: "Number",
    [FieldType.color]: "Color",
    [FieldType.text]: "Text",
    [FieldType.wysiwyg]: "Wysiwyg",
    [FieldType.array]: "Array",
    [FieldType.complex]: "Complex",
    [FieldType.entity]: "Entity",
    [FieldType.file]: "File",
    [FieldType.image]: "Image",
    [FieldType.gallery]: "Gallery",
    [FieldType.switch]: "Switch",
    [FieldType.checkbox]: "Checkbox",
    [FieldType.password]: "Password",
    [FieldType.hidden]: "Hidden",
    [FieldType.section]: "Section",
    [FieldType.autocomplete]: "Autocomplete",
    [FieldType.select]: "Select",
};

/**
 * General type definition
 */
type FormFieldConfigPrototype = {
    type: FieldType;
    /**
     * Default value
     */
    default?: any;
    /**
     * Hint string below the input
     */
    hint?: string;
    /**
     * Custom validator that can be attached to field
     */
    custom_validator?: (value: any) => string | boolean;
    /**
     * Field is required
     */
    required?: boolean;
    /**
     * Field name
     */
    name?: string;
    /**
     * If true hitting Enter key will emit the form submit event for this input
     */
    submit_on_enter?: boolean;
};

/**
 * Basic field config
 */
export type FormBasicFieldConfig = FormFieldConfigPrototype;

/**
 * Config for number fields
 */
export type FormNumberFieldConfig = FormFieldConfigPrototype & {
    type: FieldType.number;
    min?: number;
    max?: number;
    default?: number;
};

/**
 * Config for array fields
 */
export type FormArrayFieldConfig = FormFieldConfigPrototype & {
    type: FieldType.array;
    /**
     * @summary Config object for array item
     */
    item_config: FormFieldConfig;
};

/**
 * Config for object like field
 */
export type FormComplexFieldConfig = FormFieldConfigPrototype & {
    type: FieldType.complex;
    sub_fields: {
        [key: string]: FormFieldConfig;
    };
};

/**
 * Config for entity selector field
 */
export type FormEntityFieldConfig = FormFieldConfigPrototype & {
    type: FieldType.entity;
    entity_name: string;
    name_field?: string;
    value_field?: string;
};

/**
 * Config for simple string fields
 */
export type FormStringFieldConfig = FormFieldConfigPrototype & {
    type: FieldType.string;
    maxlength?: number;
    minlength?: number;
};

type CommonFileFieldConfig = {
    // Whether to attach model to File model or just its id
    is_file_value?: boolean;
    // Array of supported MIME types for files
    mimetyping?: string[];
    // When uploading use specified type instead of determining automatically from MIME
    upload_type?: string;
    // Input can accept multiple files at once
    multiple?: boolean;
};

/**
 * Config for general file type
 */
export type FormFileFieldConfig = FormFieldConfigPrototype &
    CommonFileFieldConfig & {
        type: FieldType.file;
    };

/**
 * Config for image files
 */
export type FormImageFieldConfig = FormFieldConfigPrototype &
    CommonFileFieldConfig & {
        type: FieldType.image;
        // Preview is enabled. Will display a picture box next to the input
        preview?: boolean;
        // Preview size (one of specified) will determine relative size of the preview box
        preview_size?: "small" | "normal";
    };

/**
 * Config for password fields
 */
export type FormPasswordFieldConfig = FormFieldConfigPrototype & {
    type: FieldType.password;
    toggle: boolean;
};

/**
 * Config for section field
 */
export type FormSectionFieldConfig = FormFieldConfigPrototype & {
    type: FieldType.section;
    exclude_ids?: number[];
};

/**
 * Autocomplete field config
 */
export type FormAutocompleteFieldConfig = FormFieldConfigPrototype & {
    type: FieldType.autocomplete;
    items: any[];
    maxlength?: number;
    text_prop?: string;
    value_prop?: string;
    object_return?: boolean;
    filter?: boolean;
};

/**
 * Color field config
 */
export type FormColorFieldConfig = FormFieldConfigPrototype & {
    type: FieldType.color;
};

/**
 * Wysiwyg field config
 */
export type FormWysiwygFieldConfig = FormFieldConfigPrototype & {
    type: FieldType.wysiwyg;
};

/**
 * Hidden field config
 */
export type FormHiddenFieldConfig = FormFieldConfigPrototype & {
    type: FieldType.hidden;
};

/**
 * Switch field config
 */
export type FormSwitchFieldConfig = FormFieldConfigPrototype & {
    type: FieldType.switch;
    active?: string;
    inactive?: string;
};

/**
 * Text field config
 */
export type FormTextFieldConfig = FormFieldConfigPrototype & {
    type: FieldType.text;
};

/**
 * Gallery field config
 */
export type FormGalleryFieldConfig = FormFieldConfigPrototype & {
    type: FieldType.gallery;
};

/**
 * Select field config
 */
export type FormSelectFieldConfig = FormFieldConfigPrototype & {
    type: FieldType.select;
    options: { [key: number]: string };
};

/**
 * General option field configuration type to use
 */
export type FormFieldConfig =
    | FormFieldConfigPrototype
    | FormBasicFieldConfig
    | FormNumberFieldConfig
    | FormArrayFieldConfig
    | FormComplexFieldConfig
    | FormStringFieldConfig
    | FormFileFieldConfig
    | FormPasswordFieldConfig
    | FormTextFieldConfig
    | FormWysiwygFieldConfig
    | FormGalleryFieldConfig
    | FormImageFieldConfig
    | FormColorFieldConfig
    | FormSelectFieldConfig;

/**
 * Options for component selector component
 */
export type ComponentSelectorOption = {
    value: string;
    text: string;
};

/**
 * Block description type
 */
export type ComponentBlockType = {
    name: string;
    options: { [key: string]: any };
    editableOptions?: FormConfig;
};

/**
 * Editable component options type
 */
export type FormConfig = {
    [name: string]: FormFieldConfig;
};

/**
 * Type for component options
 */
export type ComponentOptions = {
    [name: string]: any;
};

/**
 * Editor store tree node type
 */
export type EditorTreeNode = {
    id: string;
    name: string;
    children: EditorTreeNode[];
};

/**
 * Editor store block list type
 */
export type EditorBlocks = {
    [key: string]: ComponentOptions;
};

/**
 * Component configuration declaration type
 */
export type ComponentConfig = {
    /** Component name */
    name: string;
    /** Options configuration for editor */
    options: FormConfig;
    /** Whether or not component supports nesting */
    has_children?: boolean;
    /**
     * If component supports nesting can be set to prevent delete operation
     * from removing a child from the children list and instead leave the spot empty
     * so that another component can take its place. This keeps the children
     * list count and positions/indexes the same.
     */
    enforce_child_count?: boolean;
    /** Component name or short description in component selector */
    selector_text: string;
    /** Full component description for editor */
    editor_description: string;
};

/**
 * Name of options field that must contain all child elements
 * for components that support nesting.
 */
export const CHILDREN_FIELD_NAME = "blocks";

/**
 * Name basis for all form field components
 */
export const FORM_FIELD_NAME_BASE = "FormField";

/**
 * Debounce timeout for field update
 */
export const FIELD_CHANGE_DEBOUNCE_TIMEOUT = 100;

/**
 * Form validation rules
 */
export type FormFieldValidationFunction = (value: any) => boolean | string;
