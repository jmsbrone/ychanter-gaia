import { addComponentsDir, addPlugin, createResolver, defineNuxtModule, extendPages } from "@nuxt/kit";
import path from "path";

export default defineNuxtModule({
    meta: {
        name: "@ychanter/hydra",
        compatibility: {
            nuxt: "^3.0.0-rc.10",
        },
    },
    async setup(moduleOptions, nuxt) {
        addComponentsDir({
            path: "~/modules/hydra/components",
            prefix: "hydra",
        });
        extendPages((pages) => {
            const pagesBasePath = path.resolve(__dirname, "./pages");
            pages.push({
                name: "admin-hydra",
                path: "/admin/hydra",
                file: pagesBasePath + "/admin/index.vue",
                children: [],
            });
        });
        const { resolve } = createResolver(import.meta.url);
        addPlugin(resolve("./plugins/ui"));
    },
});
