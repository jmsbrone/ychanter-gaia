import { EventSystem, EventSystemPort } from "../../../core/components/events/event-system";
import { DIContainer } from "../../../core/port-manager";

export default defineNuxtPlugin(() => {
    if (process.server) {
        return;
    }
    const eventSystem = DIContainer.get<EventSystem>(EventSystemPort);
    eventSystem.subscribe("application", "init", () => {
        const leftMenu = useAdminLeftMenu();
        leftMenu.addToGroup("modules", {
            path: "/admin/web-pages",
            icon: "webpage_tree",
            title: "Web pages",
        });
    });
});
