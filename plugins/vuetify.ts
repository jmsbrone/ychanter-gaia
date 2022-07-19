import { createVuetify, ThemeDefinition } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { mdi } from "vuetify/iconsets/mdi";
import { aliases, md } from "vuetify/iconsets/md";

const appDarkTheme: ThemeDefinition = {
    dark: true,
    colors: {
        background: "#008080",
        surface: "#202020",
        primary: "#EE82EE",
        secondary: "#008080",
        accent: "#CCAD00",
        error: "#B00020",
        info: "#2196F3",
        success: "#4CAF50",
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
                mdi,
                md,
            },
        },
    });

    nuxtApp.vueApp.use(vuetify);
});
