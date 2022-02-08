// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");
// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

let root_path = process.cwd() + "/src";

const client_path = path.resolve(root_path, "./client");
const common_path = path.resolve(root_path, "./common");

module.exports = {
    srcDir: client_path,
    server: {
        port: 3001,
    },
    telemetry: false,
    head: {
        title: "client",
        htmlAttrs: {
            lang: "en",
        },
        meta: [
            { charset: "utf-8" },
            { name: "viewport", content: "width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=no" },
            { hid: "description", name: "description", content: "" },
        ],
        link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
    css: ["~/assets/styles/main.scss"],
    components: [
        {
            path: "~/modules/ui/components/",
            ignore: ["prototypes", "config.ts", "page"],
        },
        {
            path: "~/modules/ui/components/page/",
            prefix: "UiPc",
        },
        {
            path: "~/lib/components/",
        },
        {
            path: "~/modules/section/components/admin/",
            prefix: "admin-section",
        },
        {
            path: "~/modules/content/admin/components/",
            prefix: "admin-content",
        },
        {
            path: "~/modules/dashboard/admin/components/",
            prefix: "admin-dashboard",
        },
        {
            path: "~/modules/auth/components/",
            prefix: "auth",
        },
        {
            path: "~/modules/sysvar/components/",
            prefix: "admin-sysvar",
        },
        {
            path: "~/modules/file/components/admin/",
            prefix: "admin-file",
        },
        {
            path: "~/modules/dynamic-entity/admin/components/",
            prefix: "admin-dynamic-entity",
        },
    ],
    buildModules: ["@nuxt/typescript-build", "@nuxtjs/style-resources", "@nuxtjs/vuetify"],
    modules: ["@nuxtjs/axios"],
    build: {
        extractCSS: {
            ignoreOrder: true,
        },
    },
    vuetify: {
        theme: {
            dark: true,
        },
    },
    axios: {
        baseURL: process.env.BASE_URL,
    },
    publicRuntimeConfig: {
        axios: {
            browserBaseURL: process.env.BROWSER_BASE_URL,
        },
    },
    privateRuntimeConfig: {
        axios: {
            baseURL: process.env.BASE_URL,
        },
    },
    alias: {
        client: client_path,
        common: common_path,
    },
    plugins: ["~/plugins/tiptap.ts", "~plugins/icons.ts", "~plugins/init.ts"],
    dir: {
        assets: "assets",
        app: "app",
        layouts: "layouts",
        middleware: "middleware",
        pages: "pages",
        static: "static",
        store: "stores",
    },
};
