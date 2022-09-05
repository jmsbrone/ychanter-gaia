import { addPlugin, createResolver, defineNuxtModule } from "@nuxt/kit";

export default defineNuxtModule({
    meta: {
        name: "@ychanter/main",
        compatibility: {
            nuxt: "^3.0.0",
        },
    },
    async setup(moduleOptions, nuxt) {
        const { resolve } = createResolver(import.meta.url);
        addPlugin(resolve("./plugins/init"));
    },
});
