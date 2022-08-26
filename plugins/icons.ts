import "material-design-icons-iconfont/dist/material-design-icons.css";
import { IconServiceInterface } from "../core/spi/icon-service-interface";
import { MdIconService } from "../core/providers/icons/md-icon-service";

export default defineNuxtPlugin((nuxtApp) => {
    const iconService: IconServiceInterface = new MdIconService();

    return {
        provide: {
            ycIcon: (name) => iconService.getIcon(name),
        },
    };
});
