import { defineNuxtConfig } from "nuxt";
import dynamicImport from "vite-plugin-dynamic-import";

export default defineNuxtConfig({
    css: ["vuetify/lib/styles/main.sass"],
    build: {
        transpile: ["vuetify"],
    },
    buildModules: ["@pinia/nuxt"],
    vite: {
        define: {
            "process.env.DEBUG": false,
        },
        plugins: [dynamicImport()],
    },
    runtimeConfig: {
        public: {
            backendApi: process.env.PUBLIC_BACKEND_URL,
        },
        backendApi: process.env.PRIVATE_BACKEND_URL,
    },
});
