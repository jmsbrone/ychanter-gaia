import { createVuetify, ThemeDefinition } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { aliases, md } from "vuetify/iconsets/md";

const appDarkTheme: ThemeDefinition = {
    dark: true,
    colors: {
        "foreground-text": "FFFFFF",
        background: "#008080",
        surface: "#202020",
        primary: "#EE82EE",
        secondary: "#008080",
        accent: "#CCAD00",
        error: "#D22B2B",
        info: "#77FFFF",
        success: "#50C878",
        warning: "#FB8C00",
    },
};

export default defineNuxtPlugin((nuxtApp) => {
    const vuetify = createVuetify({
        components,
        directives,
        theme: {
            defaultTheme: "appDarkTheme",
            variations: {
                colors: ["primary", "secondary"],
                lighten: 2,
                darken: 2
            },
            themes: {
                appDarkTheme,
            },
        },
        icons: {
            defaultSet: "md",
            aliases,
            sets: {
                md,
            },
        },
    });

    nuxtApp.vueApp.use(vuetify);
});
