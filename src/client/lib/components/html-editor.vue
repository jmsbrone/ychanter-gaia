<template lang="pug">
tiptap-vuetify(
    v-model="content",
    :extensions="extensions",
    :toolbar-attributes="{ color: $vuetify.theme.dark ? 'dark' : 'light' }",
    placeholder="Edit content..."
)
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "nuxt-property-decorator";

// import {
//     TiptapVuetify,
//     TiptapVuetifyPlugin,
//     Heading,
//     Bold,
//     Italic,
//     Strike,
//     Underline,
//     Code,
//     Paragraph,
//     BulletList,
//     OrderedList,
//     ListItem,
//     Link,
//     Blockquote,
//     HardBreak,
//     HorizontalRule,
//     History,
// } from "tiptap-vuetify/dist/bundle-cjs";

// import dvue from "vue";
// dvue.use(TiptapVuetifyPlugin, {
//     vuetify: window["Vuetify"],
//     iconsGroup: "mdi",
// });

// @Component({ components: { TiptapVuetify } })
// export default class HtmlEditor extends Vue {
//     @Prop({ default: "" })
//     value: string;

//     extensions = [
//         Link,
//         Underline,
//         Strike,
//         Italic,
//         ListItem,
//         BulletList,
//         OrderedList,
//         [
//             Heading,
//             {
//                 options: {
//                     levels: [1, 2, 3, 4, 5, 6],
//                 },
//             },
//         ],
//         Bold,
//         Link,
//         Code,
//         HorizontalRule,
//         Paragraph,
//         HardBreak,
//     ];

//     content = "";

//     beforeMount() {
//         this.content = this.value;
//     }

//     @Watch("content")
//     onContentUpdate() {
//         this.$emit("input", this.content);
//     }
// }
@Component({})
export default class HtmlEditor extends Vue {}
</script>
<style>
@import "tiptap-vuetify/dist/main.css";
</style>
