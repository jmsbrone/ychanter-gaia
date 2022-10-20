/**
 * Mark for tiptap that controls text size level class of an element.
 */

import { Mark, mergeAttributes } from "@tiptap/vue-3";

export const textSizeMark = Mark.create({
    name: "header",
    addOptions() {
        return {
            HTMLAttributes: {},
        };
    },
    addAttributes() {
        return {
            level: {
                default: "body",
                renderHTML: (attributes) => {
                    return {
                        class: "text-" + attributes.level,
                        "header-level": attributes.level,
                    };
                },
                parseHTML: (element) => element.getAttribute("header-level"),
            },
        };
    },
    parseHTML() {
        return [
            {
                tag: "div",
                getAttrs: (node): any => (node as HTMLElement).getAttribute("header-level") && null,
            },
        ];
    },
    renderHTML({ HTMLAttributes }) {
        return ["div", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
    },
});
