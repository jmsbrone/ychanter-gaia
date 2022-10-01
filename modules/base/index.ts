import { addPlugin, createResolver, defineNuxtModule } from "@nuxt/kit";

/**
 * Base module for the system.
 */
export default defineNuxtModule({
    meta: {
        name: "@ychanter/main",
        compatibility: {
            nuxt: "3.0.0-rc.10",
        },
    },
    async setup() {
        const { resolve } = createResolver(import.meta.url);
        addPlugin(resolve("./plugins/init"));
    },
});
