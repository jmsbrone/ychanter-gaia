import { FIELD_CHANGE_DEBOUNCE_TIMEOUT, FormFieldConfig } from "client/types/editor";
import _ from "client/helpers/lodash";
import { Component, Prop, Vue, Watch } from "nuxt-property-decorator";
import { StringGenerator } from "common/factories/string-generator";
import { FormValidator } from "../../classes/form-validator";

@Component({})
export class FormFieldBase<T extends FormFieldConfig> extends Vue {
    /**
     * v-model support
     */
    @Prop()
    value: any;

    /**
     * Field configuration object
     */
    @Prop()
    config: T;

    /**
     * Rules for validation
     */
    validator: FormValidator;

    /**
     * Local value to use v-model with controlled input field
     */
    model_value: any = null;

    /**
     * ID for current input element.
     * Might be used for attaching additional functionality to fields.
     */
    input_id = "";

    /**
     * Created() hook handler. Derived components must not override it.
     * Instead perform initialization logic in init() function.
     */
    created() {
        this.onCreated();
        if (typeof this["init"] === "function") {
            this["init"]();
        }
        this.validator = new FormValidator(this.config);
    }

    /**
     * Initialization function to call on created() hook
     */
    onCreated() {
        this.model_value = this.value;
        this.input_id = `input-${StringGenerator.createRandom()}`;
    }

    /**
     * Controlled input field watcher. Watcher is debounced in order to remove lag
     * with fields that can rapidly change value (for example color picker).
     */
    @Watch("model_value", { deep: true })
    onValueChangedHandler = _.debounce(this.onValueChangedHandlerDebounced.bind(this), FIELD_CHANGE_DEBOUNCE_TIMEOUT);
    onValueChangedHandlerDebounced(): void {
        this.emitModelUpdate();
    }

    /**
     * Updating local value when v-model prop changes
     */
    @Watch("value")
    onValueChanged() {
        this.model_value = this.value;
    }

    /**
     * Returns model value for current field.
     * Depending on the field logic can be more complicated.
     * Any derived component with different field binding should override
     * this method.
     *
     * @returns Model value
     */
    getModelValue() {
        return this.model_value;
    }

    /**
     * Emit update event for v-model support
     */
    emitModelUpdate() {
        this.$emit("input", this.getModelValue());
    }

    /**
     * Sets new value for current model.
     * Should only be used when underlying input doesn't support v-model
     * and value should be set manually.
     * @param new_value
     */
    setModelValue(new_value: any) {
        this.model_value = new_value;
    }

    /**
     * Handler for pressing enter on a field
     */
    handleEnterKey() {
        if (this.config.submit_on_enter) {
            this.$emit("submit");
        }
    }

    /**
     * Emitting focus event from underlying input
     */
    onFocused() {
        this.$emit("focused");
    }

    /**
     * Emitting focus lost event from underlying input
     */
    onFocusLost() {
        this.$emit("focus-lost");
    }
}
