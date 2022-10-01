import { EventSystem, EventSystemPort } from "../../../core/components/events/event-system";
import { RxjsEventSystem } from "../../../core/components/events/rxjs-event-system";
import { SystemInfo } from "../../../core/components/system-info";
import { DIContainer } from "../../../core/port-manager";
import { init } from "../init";

if (typeof process !== 'undefined') {
    SystemInfo.isIsolated = !!process.env.INFRASTRUCTURE_MOCK;
    SystemInfo.isProductionMode = process.env.NODE_ENV === "production";
    SystemInfo.isServer = !!process.env.server;
} else {
    SystemInfo.isProductionMode = true;
    SystemInfo.isServer = false;
}

const eventSystem: EventSystem = new RxjsEventSystem();
DIContainer.register(EventSystemPort, eventSystem);

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.hook("app:created", () => {
        eventSystem.trigger("application", "init");
    });

    init();
});
