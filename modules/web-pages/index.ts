import { addComponentsDir, addPlugin, createResolver, defineNuxtModule, extendPages } from "@nuxt/kit";
import path from "path";

export default defineNuxtModule({
    meta: {
        name: "@ychanter/web-pages",
        compatibility: {
            nuxt: "^3.0.0",
        },
    },
    async setup(moduleOptions, nuxt) {
        addComponentsDir({
            path: "~/modules/web-pages/components",
            prefix: "web-page",
        });
        extendPages((pages) => {
            const pagesBasePath = path.resolve(__dirname, "./pages");
            pages.push(
                ...[
                    {
                        name: "path-slug",
                        path: "/:path?/:slug(.*)*",
                        file: pagesBasePath + "/[[path]]/[...slug].vue",
                        children: [],
                    },
                    {
                        name: "admin-web-page-designer-id",
                        path: "/admin/web-page-designer/:id?",
                        file: pagesBasePath + "/admin/web-page-designer/[[id]].vue",
                        children: [],
                    },
                    {
                        name: "admin-web-page-id",
                        path: "/admin/web-page/:id?",
                        file: pagesBasePath + "/admin/web-page/[[id]].vue",
                        children: [],
                    },
                    {
                        name: "admin-web-pages",
                        path: "/admin/web-pages",
                        file: pagesBasePath + "/admin/web-pages.vue",
                        children: [],
                    },
                ]
            );
        });
        const { resolve } = createResolver(import.meta.url);
        addPlugin(resolve("./plugins/ui"));
    },
});
