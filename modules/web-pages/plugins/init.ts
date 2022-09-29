import { EventSystem, EventSystemPort } from "../../../core/components/events/event-system";
import { SystemInfo } from "../../../core/components/system-info";
import { DIContainer } from "../../../core/port-manager";
import { WebPagesAPIPort } from "../api";
import { WebPageService } from "../services/web-page-service";
import { WebPageServiceMock } from "../services/web-page-service.mock";

export default defineNuxtPlugin(() => {
    const eventSystem = DIContainer.get<EventSystem>(EventSystemPort);
    eventSystem.subscribe("application", "init", () => {
        let isolated: boolean;
        if (process.server) {
            isolated = SystemInfo.isIsolated;
        } else {
            isolated = useState("isolated").value as boolean;
        }
        if (isolated) {
            DIContainer.register(WebPagesAPIPort, new WebPageServiceMock());
        } else {
            DIContainer.register(WebPagesAPIPort, new WebPageService());
        }
    });
});
