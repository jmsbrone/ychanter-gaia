import { addPlugin, createResolver, defineNuxtModule } from "@nuxt/kit";
import { EventSystemPort } from "../../core/components/events/event-system";
import { RxjsEventSystem } from "../../core/components/events/rxjs-event-system";
import { DIContainer } from "../../core/port-manager";

export default defineNuxtModule({
    meta: {
        name: "@ychanter/main",
        compatibility: {
            nuxt: "^3.0.0",
        },
    },
    async setup() {
        const { resolve } = createResolver(import.meta.url);
        addPlugin(resolve("./plugins/init"));

        DIContainer.register(EventSystemPort, new RxjsEventSystem());
    },
});
