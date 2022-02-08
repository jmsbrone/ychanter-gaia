import { IconServiceInterface } from "client/prototypes/icon-service-interface";
import { MdiIconService } from "client/services/icons/mdi-icon-service";

function injectIconService(inject: any, service: IconServiceInterface) {
    inject("ycIcon", (name: string) => {
        return service.getIcon(name);
    });
}

export default ({ app }, inject) => {
    injectIconService(inject, new MdiIconService());
};
