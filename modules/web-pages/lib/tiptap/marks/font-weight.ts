/**
 * Mark for tiptap that controls font weight class of an element.
 */

import { Mark, mergeAttributes } from "@tiptap/vue-3";

export const fontWeightMark = Mark.create({
    priority: 40,
    name: "fontWeight",
    addOptions() {
        return {
            HTMLAttributes: {},
        };
    },
    addAttributes() {
        return {
            weight: {
                default: "none",
                renderHTML: (attributes) => {
                    return {
                        class: "font-weight-" + attributes.weight,
                        "font-weight": attributes.weight,
                    };
                },
                parseHTML: (element) => element.getAttribute("font-weight"),
            },
        };
    },
    parseHTML() {
        return [
            {
                tag: "span",
                getAttrs: (node): any => (node as HTMLElement).getAttribute("font-weight") && null,
            },
        ];
    },
    renderHTML({ HTMLAttributes }) {
        return ["span", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
    },
});
