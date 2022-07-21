import _ from "lodash";
import { ComponentOptions } from "nuxt/dist/app/compat/capi";
import { StringGenerator } from "../../../core/services/string-generator";
import { PlainObject } from "../../../core/types/basic";
import {
    CHILDREN_FIELD_NAME,
    ComponentBlockType,
    ComponentConfig,
    EditorBlocks,
    EditorTreeNode,
    FormConfig,
} from "../../../core/types/editor";
import { FieldType } from "../../../core/types/field-type-enum";
import { ContainerComponentConfig } from "../component_configs/container";
import { DummyComponentConfig } from "../component_configs/dummy";
import { ContentTextComponentConfig } from "../component_configs/text";

/**
 * @constant BLOCK_ID_LENGTH Length of string with generated component block id
 */
const BLOCK_ID_LENGTH = 8;

/**
 * @constant COMPONENTS_CONFIG All available components
 */
export const COMPONENTS_CONFIG: { [key: string]: ComponentConfig } = {
    [ContentTextComponentConfig.name]: ContentTextComponentConfig,
    [DummyComponentConfig.name]: DummyComponentConfig,
    [ContainerComponentConfig.name]: ContainerComponentConfig,
};

/**
 * @type Object containing tree note information after it's processed
 */
export type ProcessedBlockType = {
    blocks: PlainObject;
    tree: EditorTreeNode;
};

/**
 * @type Component block data object
 */
export type BlockData = {
    name: string;
    options: ComponentOptions;
};

/**
 * @class Helper class for editor store. Majority of its logic is performed here.
 */
export class EditorHelper {
    /**
     * Generates random component block id.
     * @returns
     */
    public static generateBlockId() {
        return StringGenerator.createRandom(BLOCK_ID_LENGTH);
    }

    /**
     * Returns options for component
     * @param name Registered component's name
     * @returns
     */
    public static getComponentOptionsByName(name: string): FormConfig {
        return COMPONENTS_CONFIG[name].options;
    }

    /**
     * Returns true if specified component has configuration options
     * @param name
     * @returns
     */
    public static hasOptions(name: string): boolean {
        return !_.isEmpty(COMPONENTS_CONFIG[name].options);
    }

    /**
     * Returns an object containing a map of component names to its description
     * for selector. Component name is the name it's registered with and text is
     * taken from field `selector_text` in component configuration.
     *
     * @returns
     */
    public static getComponentsForSelector(): { [key: string]: ComponentConfig } {
        const result = {};
        _.each(COMPONENTS_CONFIG, (config, name) => {
            result[name] = config;
        });

        return result;
    }

    /**
     * Extracts data from given block in required format
     * @param block Component tree note data (this is the raw data stored in page content)
     * @returns
     */
    public static processBlock(block: ComponentBlockType): ProcessedBlockType {
        if (block.name !== null && !COMPONENTS_CONFIG.hasOwnProperty(block.name)) {
            block.name = DummyComponentConfig.name;
        }

        const block_id = this.generateBlockId();
        const block_children = [];
        const blocks = {};
        blocks[block_id] = block.options || {};
        const component_config = COMPONENTS_CONFIG[block.name];

        if (component_config) {
            if (component_config.has_children && block.options[CHILDREN_FIELD_NAME]) {
                _.each(block.options[CHILDREN_FIELD_NAME], (item) => {
                    const child_block_processed = this.processBlock(item);
                    _.merge(blocks, child_block_processed.blocks);
                    block_children.push(child_block_processed.tree);
                });
            }
        }

        return {
            blocks: blocks,
            tree: {
                id: block_id,
                name: block.name,
                children: block_children,
            },
        };
    }

    /**
     * Creates new component by name with default options
     * @param name Registered component name
     * @returns
     */
    public static createNewComponent(name: string) {
        const editable_options = COMPONENTS_CONFIG[name].options;
        const options = {};
        _.each(editable_options, (config, name) => {
            options[name] = config.default ?? null;
        });
        return {
            id: this.generateBlockId(),
            name: name,
            options: options,
            children: [],
        };
    }

    /**
     * Adds node to children of specified block id in the tree
     * @param parent_id Parent component block id
     * @param child_data Editor tree note with component to insert
     * @param tree Current page tree reference (from editor store)
     * @returns
     */
    public static addChildTo(parent_id: string, child_data: EditorTreeNode, tree: EditorTreeNode): boolean {
        if (tree.id === parent_id) {
            tree.children.push(child_data);
            return true;
        } else {
            for (let i = 0; i < tree.children.length; ++i) {
                if (this.addChildTo(parent_id, child_data, tree.children[i])) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Deletes block with given id from the tree
     * @param id Component block id to delete
     * @param tree Editor tree reference
     * @returns
     */
    public static deleteBlockFromTree(id: string, tree: EditorTreeNode): boolean {
        let delete_index = undefined;
        for (let i = 0; i < tree.children.length; ++i) {
            if (tree.children[i].id === id) {
                delete_index = i;
                break;
            } else if (this.deleteBlockFromTree(id, tree.children[i])) {
                return true;
            }
        }

        if (_.isNumber(delete_index)) {
            const component_config = COMPONENTS_CONFIG[tree.name];
            if (component_config && component_config.enforce_child_count) {
                tree.children[delete_index].name = null;
            } else {
                tree.children.splice(delete_index, 1);
            }
            return true;
        }

        return false;
    }

    /**
     * Collects data from tree and blocks to form web page data tree that can be saved.
     * Does the opposite to processBlock() function and creates tree note data that
     * should be saved in page content.
     * @param tree Editor tree reference
     * @param blocks Editor blocks reference
     * @returns
     */
    public static implodeWebPageDataForSaving(tree: EditorTreeNode, blocks: EditorBlocks): BlockData {
        const result: BlockData = {
            name: tree.name,
            options: tree.id ? _.cloneDeep(blocks[tree.id]) : {},
        };
        if (tree.id === null || (tree.name && COMPONENTS_CONFIG[tree.name].has_children)) {
            result.options[CHILDREN_FIELD_NAME] = [];
            _.each(tree.children, (child) => {
                result.options[CHILDREN_FIELD_NAME].push(this.implodeWebPageDataForSaving(child, blocks));
            });
        }

        return result;
    }

    /**
     * Traverses the current tree and collects values for all component options fields whose type
     * is determined by 3rd argument.
     * @param tree Editor tree reference
     * @param blocks Editor blocks reference
     * @param type Field type to check against or function that will perform the check and return true/false
     * @returns
     */
    private static collectUsedFieldsByType(
        tree: EditorTreeNode,
        blocks: EditorBlocks,
        type: FieldType | ((type: FieldType) => boolean)
    ) {
        const result = [];
        let component_config: ComponentConfig;
        if (tree.id !== null && tree.name !== null) {
            const node_data = blocks[tree.id];
            component_config = COMPONENTS_CONFIG[tree.name];
            _.each(component_config.options, (config, name) => {
                const type_matched_by_function = typeof type === "function" && type(config.type);
                const type_matched_by_value = typeof type === "number" && type === config.type;
                if ((type_matched_by_function || type_matched_by_value) && node_data[name] !== null) {
                    result.push(node_data[name]);
                }
            });
        }
        if (tree.id === null || (component_config && component_config.has_children)) {
            _.each(tree.children, (child_node) => {
                result.push(...this.collectUsedFieldsByType(child_node, blocks, type));
            });
        }

        return result;
    }

    /**
     * Traverses the current tree and collects all file ids in all component options fields
     * which are of file type.
     * @param tree Editor tree reference
     * @param blocks Editor blocks reference
     * @returns
     */
    public static collectUsedFilesList(tree: EditorTreeNode, blocks: EditorBlocks): number[] {
        return this.collectUsedFieldsByType(tree, blocks, (type: FieldType) => (type & FieldType.file) > 0);
    }

    /**
     * Traverses the current tree and collects all gallery ids in all component options fields
     * which are of gallery type.
     * @param tree Editor tree reference
     * @param blocks Editor blocks reference
     * @returns
     */
    public static collectUsedGalleries(tree: EditorTreeNode, blocks: EditorBlocks): number[] {
        return this.collectUsedFieldsByType(tree, blocks, FieldType.gallery);
    }

    /**
     * Returns tree node by id
     * @param id
     * @param tree
     * @returns
     */
    public static findNodeById(id: string | null, tree: EditorTreeNode): EditorTreeNode | null {
        if (tree.id === id) {
            return tree;
        }
        let result = null;
        for (let i = 0; i < tree.children.length; ++i) {
            result = this.findNodeById(id, tree.children[i]);
            if (result) {
                break;
            }
        }

        return result;
    }

    /**
     * Returns parent node for given block id
     * @param id
     * @param tree
     * @returns
     */
    public static findParentNodeForId(id: string, tree: EditorTreeNode): EditorTreeNode | null {
        let result = null;
        for (let i = 0; i < tree.children.length; ++i) {
            if (tree.children[i].id === id) {
                result = tree;
                break;
            }
            result = this.findParentNodeForId(id, tree.children[i]);
            if (result) {
                break;
            }
        }

        return result;
    }

    /**
     * Moves given block from current position to given parent after specified child
     * @param id
     * @param new_parent_id
     * @param after_child_id
     * @param tree
     */
    public static moveBlock(
        id: string,
        new_parent_id: string | null,
        after_child_id: string,
        tree: EditorTreeNode,
        blocks: EditorBlocks
    ) {
        if (id === after_child_id) {
            return;
        }

        const block_node = this.findNodeById(id, tree);
        const parent_node = this.findParentNodeForId(id, tree);
        const new_parent_node = this.findNodeById(new_parent_id, tree);
        const child_node_index = parent_node.children.indexOf(block_node);

        if (
            parent_node.name !== null &&
            parent_node !== new_parent_node &&
            COMPONENTS_CONFIG[parent_node.name].enforce_child_count
        ) {
            const new_block_id = this.generateBlockId();
            parent_node.children[child_node_index] = {
                id: new_block_id,
                name: null,
                children: [],
            };
            blocks[new_block_id] = {};
        } else {
            parent_node.children.splice(child_node_index, 1);
        }

        if (!after_child_id) {
            const new_children_list = [block_node, ...new_parent_node.children];
            new_parent_node.children = new_children_list;
        } else {
            let following_blocks = [];
            for (let i = 0; i < new_parent_node.children.length - 1; ++i) {
                if (new_parent_node.children[i].id === after_child_id) {
                    following_blocks = new_parent_node.children.splice(i + 1);
                    break;
                }
            }
            new_parent_node.children.push(block_node, ...following_blocks);
        }
    }
}
