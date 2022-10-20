<template lang="pug">
.d-flex.flex-column
    bubble-menu(:editor="editor", @click.stop)
        v-card(elevation="16")
            v-card-text
                v-row(no-gutters)
                    v-btn(
                        v-for="(config, index) in decoratorButtons", :key="index",
                        @click="config.callback()",
                        :class="{ 'is-active': config.activeCheckCallback() }",
                        size="small",
                    ) {{ config.text }}
    floating-menu(:editor="editor", @click.stop)
        v-btn(
            :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }") H1
    editor-content(:editor="editor", @click.stop)
</template>

<script setup lang="ts">
import { Editor, EditorContent, FloatingMenu, BubbleMenu } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import type { PlainObject } from "../../../../core/types/basic";
import type { EditorTreeNode } from "../../../../core/types/editor";
import { fontWeightMark } from "../../lib/tiptap/marks/font-weight";
import { textSizeMark } from "../../lib/tiptap/marks/text-size";
import { textAlignMark } from "../../lib/tiptap/marks/text-align";
import _ from "lodash";
import { useEditorStore } from "../../store/editor";
import { textDecorationMark } from "../../lib/tiptap/marks/text-decoration";

/**
 * --------------------------------------------------------
 * Component definitions
 * --------------------------------------------------------
 */

const props = defineProps<{
    options?: PlainObject;
    editorBlock?: EditorTreeNode;
}>();

const editorStore = useEditorStore();

const controlButtonsConfig = [
    ["fontWeight", { weight: "bold" }, "B"],
    ["header", { level: "h1" }, "H1"],
    ["header", { level: "body" }, "Body"],
    ["textAlign", { align: "left" }, "<|"],
    ["textAlign", { align: "center" }, "<|>"],
    ["textAlign", { align: "right" }, "|>"],
    ["textDecoration", { decoration: "line-through" }, "s"],
    ["textDecoration", { decoration: "underline" }, "u"],
];

const decoratorButtons = _.map(controlButtonsConfig, (config) => {
    const mark: any = config[0];
    const args: any = config[1];
    const text = config[2];

    return {
        callback: () => editor.chain().toggleMark(mark, args).run(),
        text,
        activeCheckCallback: () => editor.isActive(mark, args),
    };
});

const editor = new Editor({
    content: "",
    extensions: [StarterKit, textSizeMark, fontWeightMark, textAlignMark, textDecorationMark],
    editable: true,
    injectCSS: false,
    onUpdate: () => {
        editorStore.updateBlock({
            id: props.editorBlock.id,
            options: { text: editor.getHTML().replaceAll(/<p>|<\/p>/g, "") },
        });
    },
});

editorStore.$subscribe((mutation, state) => {
    if (mutation.type === "direct") {
        return;
    }
    const options = editorStore.blockOptions(props.editorBlock.id);
    editor.commands.setContent(options.text, false);
});
</script>

<style scoped lang="scss">
.is-active {
    background-color: rgba(var(--v-theme-secondary));
}
</style>
