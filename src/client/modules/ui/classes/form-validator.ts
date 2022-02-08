/**
 * @summary
 *
 * Class for providing form validation based on passed config.
 */

import _ from "client/helpers/lodash";
import { FormAutocompleteFieldConfig, FormFieldConfig, FormFieldValidationFunction } from "client/types/editor";
import { FieldType } from "common/core/types/field-type-enum";

export class FormValidator {
    private _rules: FormFieldValidationFunction[] = [];
    private available_rules = ["required", "maxlength", "minlength", "min", "max", "mimetyping", "custom_validator"];
    private object_mode = false;
    private object_value_field = "value";

    private validators = {
        required(value: any) {
            return !!value || "Required";
        },
        maxlength(value: string) {
            if (this.object_mode && value) {
                value = value[this.object_value_field];
            }
            return (
                !value ||
                (!!value && value.length < this._config.maxlength) ||
                `Maximum ${this._config.maxlength} characters`
            );
        },
        minlength(value: string) {
            return (
                (!!value && value.length >= this._config.minlength) || `Minimum ${this._config.minlength} characters`
            );
        },
        min(value: number) {
            return value >= this._config.min || `Number must be greater or equal to ${this._config.min}`;
        },
        max(value: number) {
            return value <= this._config.max || `Number must be less or equal to ${this._config.min}`;
        },
        mimetyping(value: File | File[]) {
            if (!value || !this._config.mimetyping) {
                return true;
            }
            let valid = true;
            if (!_.isArray(value)) {
                value = [value];
            }
            _.each(value, (file) => {
                valid = valid && _.includes(this._config.mimetyping, file.type);
            });
            return valid || `Invalid file type. Supported file types are: ${_.join(this._config.mimetyping, ",")}`;
        },
        custom_validator(value: any) {
            return this._config.custom_validator(value) || `Invalid value`;
        },
    };

    /**
     * Creates new instance of validator from given config
     * @param _config
     */
    constructor(private _config: FormFieldConfig) {
        if (_config.type === FieldType.autocomplete) {
            const config = _config as FormAutocompleteFieldConfig;
            this.object_mode = config.object_return;
            this.object_value_field = config.value_prop;
        }

        _.each(this._config, (value, key) => {
            if (this.available_rules.indexOf(key) > -1 && value) {
                this._rules.push(this.validators[key].bind(this));
            }
        });
    }

    /**
     * Return rules to be used with vuetify input fields
     */
    get rules() {
        return this._rules;
    }
}
