/**
 * Mark for tiptap that controls text align class of an element.
 */

import { Mark, mergeAttributes } from "@tiptap/vue-3";

export const textAlignMark = Mark.create({
    name: "textAlign",
    addOptions() {
        return {
            HTMLAttributes: {},
        };
    },
    addAttributes() {
        return {
            align: {
                default: "left",
                renderHTML: (attributes) => {
                    return {
                        class: "text-" + attributes.align,
                        "text-align": attributes.align,
                    };
                },
                parseHTML: (element) => element.getAttribute("text-align"),
            },
        };
    },
    parseHTML() {
        return [
            {
                tag: "div",
                getAttrs: (node): any => (node as HTMLElement).getAttribute("text-align") && null,
            },
        ];
    },
    renderHTML({ HTMLAttributes }) {
        return ["div", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
    },
});
