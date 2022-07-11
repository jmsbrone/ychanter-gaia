import { ComponentOptions } from "client/types/editor";
import { Component, Prop, Vue } from "nuxt-property-decorator";
import _ from "client/core/helpers/lodash";

@Component({})
export class EditableComponentPrototype extends Vue {
    options: ComponentOptions = {};

    @Prop()
    editor_block: { id: string; name: string; children: any[] };

    @Prop({ default: false })
    drop_zones_on: boolean;

    /**
     * Counter will increment every time options are updated from the store.
     * This is useful if some child components need to be recreated with new options
     * like Form component.
     */
    options_version = 0;

    /**
     * When selected component options dialog is shown
     */
    options_dialog_open = false;

    beforeMount() {
        this.options = this.$store.getters["editor/blockOptions"](this.editor_block.id);
        if (this.editor_block.id === this.$store.state.editor.last_generated_component_id && !_.isEmpty(this.options)) {
            this.options_dialog_open = true;
        }
        this.$store.subscribe((mutation, state) => {
            const current_block = mutation.payload && mutation.payload.id === this.editor_block.id;
            const time_travel_mutation = mutation.type === "editor/timeTravel";
            const current_block_update_mutation = mutation.type === "editor/updateBlock" && current_block;
            const block_recreate_mutation = mutation.type === "editor/recreateBlock" && current_block;
            if (current_block_update_mutation || time_travel_mutation || block_recreate_mutation) {
                this.options = this.$store.getters["editor/blockOptions"](this.editor_block.id);
                this.options_version++;
            }
        });
    }

    /**
     * Opens options editor
     */
    openOptionsDialog() {
        this.options_dialog_open = true;
    }

    /**
     * Handler for adding a component to the child list
     * @param component_name
     */
    addChildComponent(component_name: string) {
        this.$store.commit("editor/addBlock", {
            name: component_name,
            parent_id: this.editor_block.id,
        });
    }
}
