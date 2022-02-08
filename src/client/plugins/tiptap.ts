/**
 * @summary
 *
 * Plugin for tiptap.
 * Due to high bundle size the only requirement
 * is to store Vuetify instance for lazy loading.
 */

export default ({ app }) => {
    if (typeof window !== "undefined") {
        window["Vuetify"] = app.vuetify;
    }
};
