/**
 * @summary Store module for use with page editor.
 */
import _ from "client/helpers/lodash";

import { COMPONENTS_CONFIG, EditorHelper } from "client/helpers/editor-store-helper";
import { CHILDREN_FIELD_NAME, ComponentSelectorOption, EditorBlocks, EditorTreeNode } from "client/types/editor";
import { Module, VuexModule, Mutation, MutationAction } from "vuex-module-decorators";
import { SectionService } from "client/modules/section/services/section-service";
import { UpdateSectionDto } from "common/dto/section/update-section.dto";
import { Section } from "client/modules/section/domains/section";

@Module({
    name: "editor",
    namespaced: true,
    stateFactory: true,
})
export class EditorStore extends VuexModule {
    /**
     * Properties for private usage
     */
    // List of component options by id
    _blocks: EditorBlocks = {};
    // Component tree
    _tree: EditorTreeNode = {
        id: null,
        name: null,
        children: [],
    };

    /**
     * Usable state props
     */
    // Block mode flag
    edit_border_on = false;
    // Dragging detection flag
    dragging_mode = false;
    // Currently dragged id
    dragged_block_id: string = null;
    // Component configuration data to be used in editor
    component_editable_options = COMPONENTS_CONFIG;
    // Current section
    section: Section = null;
    // Toggling nestable components' "add component" button
    show_add_button = true;
    // Last generated component id
    last_generated_component_id: string = null;

    /**
     * Sets currently edited section
     *
     * @param section
     */
    @Mutation
    setSection(section: Section) {
        this.section = section;
        let section_blocks = [];
        try {
            section_blocks = JSON.parse(section.content);
        } catch (error) {
            console.error(error);
        }
        this._blocks = {};
        this._tree.children = [];
        _.each(section_blocks, (block) => {
            const processed_block = EditorHelper.processBlock(block);
            _.merge(this._blocks, processed_block.blocks);
            this._tree.children.push(processed_block.tree);
        });
    }

    /**
     * Updates block by id
     */
    @Mutation
    updateBlock({ id, options }) {
        this._blocks[id] = options;
    }

    /**
     * Deletes block by id
     * @param id
     */
    @Mutation
    deleteBlock(id: string) {
        if (!EditorHelper.deleteBlockFromTree(id, this._tree)) {
            console.error("Failed to delete block ID=" + id);
        } else {
            delete this._blocks[id];
        }
    }

    /**
     * Toggle dragging flag
     * @param value
     */
    @Mutation
    setDraggingMode(value: boolean) {
        this.dragging_mode = value;
    }

    /**
     * Block mode toggle
     * @param value
     */
    @Mutation
    setEditBorder(value: boolean) {
        this.edit_border_on = value;
    }

    /**
     * Sets new medium instance.
     * There is a weird issue with having instance in the state - recursion under the hood.
     * Storing it in helper instead of state fixes it.
     * @param value
     */
    @Mutation
    setMediumEditorInstance(value: any) {
        EditorHelper.setMediumInstance(value);
    }

    /**
     * Adds new component by name to given parent
     * @param data
     */
    @Mutation
    addBlock(data: { parent_id: string; name: string }) {
        const new_component = EditorHelper.createNewComponent(data.name);
        this._blocks[new_component.id] = new_component.options;
        this.last_generated_component_id = new_component.id;
        EditorHelper.addChildTo(
            data.parent_id,
            {
                id: new_component.id,
                name: new_component.name,
                children: new_component.children,
            },
            this._tree
        );
    }

    /**
     * Recreates given block as a new component
     * @param data
     */
    @Mutation
    recreateBlock({ id, name }) {
        const new_component = EditorHelper.createNewComponent(name);
        this._blocks[id] = new_component.options;
        const node = EditorHelper.findNodeById(id, this._tree);
        node.name = name;
    }

    /**
     * Saves current page state
     */
    @MutationAction
    async save() {
        const page_data = EditorHelper.implodeSectionDataForSaving(this._tree, this._blocks);
        const section: Section = _.cloneDeep(this.section);
        section.content = JSON.stringify(page_data.options[CHILDREN_FIELD_NAME]);
        try {
            const update_data = _.assign(new UpdateSectionDto(), section);
            const section_service = new SectionService();
            await section_service.save(update_data);
            await section_service.updateSectionResources(
                section.id,
                EditorHelper.collectUsedFilesList(this._tree, this._blocks),
                EditorHelper.collectUsedGalleries(this._tree, this._blocks)
            );

            return { section };
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    /**
     * Sets state to dragging mode
     * @param id
     */
    @Mutation
    startDragging(id: string) {
        this.dragged_block_id = id;
        this.dragging_mode = true;
    }

    /**
     * Turns off dragging mode
     */
    @Mutation
    stopDragging() {
        this.dragged_block_id = null;
        this.dragging_mode = false;
    }

    /**
     * Drops currently dragged item in specified place
     * @param data
     */
    @Mutation
    dropDraggedBlock({ parent_id, after_id }) {
        EditorHelper.moveBlock(this.dragged_block_id, parent_id, after_id, this._tree, this._blocks);
    }

    /**
     * Sets given block to have specified number of children adding to
     * or removing from the end if necessary
     * @param data
     * @returns
     */
    @Mutation
    setBlockChildCount({ id, count }) {
        const tree_node = EditorHelper.findNodeById(id, this._tree);
        if (!tree_node) {
            console.error("Block not found when trying to update child count");
            return;
        }

        const current_count = tree_node.children.length;
        let number_diff: number = count - current_count;
        if (number_diff < 0) {
            tree_node.children.splice(count, -number_diff);
        } else {
            while (number_diff-- > 0) {
                EditorHelper.addChildTo(
                    id,
                    {
                        name: null,
                        children: [],
                        id: EditorHelper.generateBlockId(),
                    },
                    this._tree
                );
            }
        }
    }

    /**
     * Trigger mutation to update components
     */
    @Mutation
    timeTravel() {}

    /**
     * Toggle "add component" button visibility
     * @param value
     */
    @Mutation
    setShowAddButton(value: boolean) {
        this.show_add_button = value;
    }

    /**
     * Retrieve medium editor instance
     */
    get mediumEditorInstance() {
        return EditorHelper.getMediumInstance();
    }

    /**
     * Retrieve block options by id
     * @returns function(id)
     */
    get blockOptions() {
        return (id: string) => {
            return this._blocks[id];
        };
    }

    /**
     * Retrieve list of top level components
     */
    get pageBlocks() {
        return this._tree.children;
    }

    /**
     * Returns component options by name
     */
    get componentOptions() {
        return (name: string) => {
            return EditorHelper.getComponentOptionsByName(name);
        };
    }

    /**
     * Returns whether or not component has options
     */
    get componentHasOptions() {
        return (name: string) => {
            return !_.isEmpty(EditorHelper.getComponentOptionsByName(name));
        };
    }

    /** Returns component selector options */
    get componentSelection(): ComponentSelectorOption[] {
        const components_mapped = EditorHelper.getComponentsForSelector();
        const result: ComponentSelectorOption[] = [{ value: null, text: "Select new component" }];
        _.each(components_mapped, (text, value) => {
            result.push({ value, text });
        });

        return result;
    }
}
