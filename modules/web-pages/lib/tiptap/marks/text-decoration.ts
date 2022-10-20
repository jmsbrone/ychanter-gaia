/**
 * Mark for tiptap that controls font decoration class of an element.
 */

import { Mark, mergeAttributes } from "@tiptap/vue-3";

export const textDecorationMark = Mark.create({
    priority: 50,
    name: "textDecoration",
    addOptions() {
        return {
            HTMLAttributes: {},
        };
    },
    addAttributes() {
        return {
            decoration: {
                default: "none",
                renderHTML: (attributes) => {
                    return {
                        class: "text-decoration-" + attributes.decoration,
                        "text-decoration": attributes.decoration,
                    };
                },
                parseHTML: (element) => element.getAttribute("text-decoration"),
            },
        };
    },
    parseHTML() {
        return [
            {
                tag: "span",
                getAttrs: (node): any => (node as HTMLElement).getAttribute("text-decoration") && null,
            },
        ];
    },
    renderHTML({ HTMLAttributes }) {
        return ["span", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
    },
});
