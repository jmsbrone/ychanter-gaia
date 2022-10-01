import { defineNuxtConfig } from "nuxt";
import dynamicImport from "vite-plugin-dynamic-import";
import modules from "./modules.json";

export default defineNuxtConfig({
    css: ["vuetify/lib/styles/main.sass"],
    build: {
        transpile: ["vuetify"],
    },
    buildModules: [["@pinia/nuxt", { disableVuex: true }]],
    modules: [...modules, "./modules/base"],
    vite: {
        define: {
            "process.env.DEBUG": false,
        },
        plugins: [dynamicImport()],
    },
    runtimeConfig: {
        public: {
            backendApi: process.env.PUBLIC_BACKEND_URL,
            storageUrl: process.env.FILE_STORAGE_URL,
        },
        backendApi: process.env.PRIVATE_BACKEND_URL,
    },
    components: [
        { path: "~/components", global: true },
        { path: "~/modules/ui/components", prefix: "ui", global: true },
    ],
});
