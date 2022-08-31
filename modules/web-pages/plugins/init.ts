import { DIContainer } from "../../../core/port-manager";
import { WebPageService } from "../services/web-page-service";

export default defineNuxtPlugin((app) => {
    DIContainer.register("WebPagesAPI", new WebPageService());
});
