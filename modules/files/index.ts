import { addComponentsDir, addPlugin, createResolver, defineNuxtModule, extendPages } from "@nuxt/kit";
import path from "path";

export default defineNuxtModule({
    meta: {
        name: "@ychanter/files",
        compatibility: {
            nuxt: "^3.0.0-rc.10",
        },
    },
    async setup(moduleOptions, nuxt) {
        addComponentsDir({
            path: "~/modules/files/components",
            prefix: "files",
        });
        extendPages((pages) => {
            const pagesBasePath = path.resolve(__dirname, "./pages");
            pages.push(
                ...[
                    {
                        name: "admin-content-gallery-id",
                        path: "/admin/content/gallery/:id?",
                        file: pagesBasePath + "/admin/content/gallery/[[id]].vue",
                        children: [],
                    },
                    {
                        name: "admin-content-playlist-id",
                        path: "/admin/content/playlist/:id?",
                        file: pagesBasePath + "/admin/content/playlist/[[id]].vue",
                        children: [],
                    },
                    {
                        name: "admin-content-galleries",
                        path: "/admin/content/galleries",
                        file: pagesBasePath + "/admin/content/galleries.vue",
                        children: [],
                    },
                    {
                        name: "admin-content-playlists",
                        path: "/admin/content/playlists",
                        file: pagesBasePath + "/admin/content/playlists.vue",
                        children: [],
                    },
                    {
                        name: "admin-content-index",
                        path: "/admin/content",
                        file: pagesBasePath + "/admin/content/index.vue",
                        children: [],
                    },
                ]
            );
        });
        const { resolve } = createResolver(import.meta.url);
        addPlugin(resolve("./plugins/ui"));
        addPlugin(resolve("./plugins/init"));
    },
});
