import _ from "lodash";
import { AppNotification } from "../core/types/app";

export const useAppNotificationState = () =>
    useState<AppNotification>("notification", () => {
        return {
            open: false,
            text: "",
            type: "error",
        };
    });

export function useAppNotification() {
    const notification = useAppNotificationState();

    function showNotification(text: string, type: "success" | "info" | "warning" | "error") {
        _.assign(notification.value, { open: true, text, type });
    }

    return {
        showError(text: string) {
            showNotification(text, "error");
        },
        showSuccess(text: string) {
            showNotification(text, "success");
        },
        showInfo(text: string) {
            showNotification(text, "info");
        },
        showWarning(text: string) {
            showNotification(text, "warning");
        },
    };
}
