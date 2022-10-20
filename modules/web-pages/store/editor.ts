import _ from "lodash";
import { defineStore } from "pinia";
import { DIContainer } from "../../../core/port-manager";
import { CHILDREN_FIELD_NAME } from "../../../core/types/editor";
import { WebPagesAPI } from "../api";
import { WebPage } from "../domains/web-page";
import { UpdateWebPageDto } from "../dto/web-page-dto";
import { COMPONENTS_CONFIG, EditorHelper } from "../helpers/editor-helper";
import { useEditorHistoryStore } from "./editor-history";

export const useEditorStore = defineStore({
    id: "editor-store",
    state: () => {
        const initialState = {
            // List of component options by id
            _blocks: {},
            // Component tree
            _tree: {
                id: null,
                name: null,
                children: [],
            },
            // Block mode flag
            edit_border_on: false,
            // Dragging detection flag
            dragging_mode: false,
            // Currently dragged id
            dragged_block_id: null,
            // Component configuration data to be used in editor
            component_editable_options: COMPONENTS_CONFIG,
            // Current page
            webPage: null,
            // Toggling nestable components' "add component" button
            show_add_button: true,
            // Last generated component id
            last_generated_component_id: null,
            // Toggling display of buttons to add children in components
            show_child_add_buttons: true,
        };

        return initialState;
    },
    getters: {
        blockOptions() {
            return (id: string) => {
                return this._blocks[id];
            };
        },
        pageBlocks() {
            return this._tree.children;
        },
        componentOptions() {
            return (name: string) => {
                return EditorHelper.getComponentOptionsByName(name);
            };
        },
        componentHasOptions() {
            return (name: string) => {
                return !_.isEmpty(EditorHelper.getComponentOptionsByName(name));
            };
        },
        hasPreviousState: (): boolean => {
            const editorHistoryStore = useEditorHistoryStore();
            return editorHistoryStore.previousState !== null;
        },
        hasNextState: (): boolean => {
            const editorHistoryStore = useEditorHistoryStore();
            return editorHistoryStore.nextState !== null;
        },
    },
    actions: {
        setPage(webPage: WebPage) {
            this.webPage = webPage;
            let page_blocks = [];
            page_blocks = JSON.parse(webPage.content);
            this._blocks = {};
            this._tree.children = [];
            _.each(page_blocks, (block) => {
                const processed_block = EditorHelper.processBlock(block);
                _.merge(this._blocks, processed_block.blocks);
                this._tree.children.push(processed_block.tree);
            });

            const editorHistoryStore = useEditorHistoryStore();
            editorHistoryStore.pushState(this.$state);
        },
        updateBlock({ id, options }) {
            this._blocks[id] = _.cloneDeep(options);

            const editorHistoryStore = useEditorHistoryStore();
            editorHistoryStore.pushState(this.$state);
        },
        deleteBlock(id: string) {
            if (!EditorHelper.deleteBlockFromTree(id, this._tree)) {
                const notification = useAppNotification();
                notification.showError("Failed to delete block ID=" + id);
            } else {
                delete this._blocks[id];
            }
            const editorHistoryStore = useEditorHistoryStore();
            editorHistoryStore.pushState(this.$state);
        },
        setDraggingMode(value: boolean) {
            this.dragging_mode = value;
        },
        setEditBorder(value: boolean) {
            this.edit_border_on = value;
        },
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
        },
        recreateBlock({ id, name }) {
            const new_component = EditorHelper.createNewComponent(name);
            this._blocks[id] = new_component.options;
            const node = EditorHelper.findNodeById(id, this._tree);
            node.name = name;
        },
        async save() {
            const page_data = EditorHelper.implodeWebPageDataForSaving(this._tree, this._blocks);
            const webPage: WebPage = _.cloneDeep(this.webPage);
            webPage.content = JSON.stringify(page_data.options[CHILDREN_FIELD_NAME]);
            try {
                const update_data = _.assign(new UpdateWebPageDto(), _.pick(webPage, ["id", "content"]));
                const webPageService = DIContainer.get<WebPagesAPI>("WebPagesAPI");
                await webPageService.save(update_data);
                await webPageService.updateWebPageResources(
                    webPage.id,
                    EditorHelper.collectUsedFilesList(this._tree, this._blocks),
                    EditorHelper.collectUsedGalleries(this._tree, this._blocks)
                );

                return { webPage };
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        startDragging(id: string) {
            this.dragged_block_id = id;
            this.dragging_mode = true;
        },
        stopDragging() {
            this.dragged_block_id = null;
            this.dragging_mode = false;
        },
        dropDraggedBlock({ parent_id, after_id }) {
            EditorHelper.moveBlock(this.dragged_block_id, parent_id, after_id, this._tree, this._blocks);
        },
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
        },
        setShowAddButton(value: boolean) {
            this.show_add_button = value;
        },
    },
});
