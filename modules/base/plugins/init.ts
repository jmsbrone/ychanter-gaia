import { EventSystem, EventSystemPort } from "../../../core/components/events/event-system";
import { RxjsEventSystem } from "../../../core/components/events/rxjs-event-system";
import { SystemInfo } from "../../../core/components/system-info";
import { DIContainer } from "../../../core/port-manager";
import { init } from "../init";

SystemInfo.isIsolated = !!process.env.INFRASTRUCTURE_MOCK;

const eventSystem: EventSystem = new RxjsEventSystem();
DIContainer.register(EventSystemPort, eventSystem);

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.hook("app:created", () => {
        eventSystem.trigger("application", "init");
    });

    init();
});
