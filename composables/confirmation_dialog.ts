import _ from "lodash";

export const useConfirmationDialogState = () =>
    useState("confirmationDialog", () => {
        return {
            open: false,
            title: "",
            text: "",
            confirmCallback: null,
            cancelCallback: null,
        };
    });

export function useConfirmationDialog() {
    return {
        confirm(title: string, text: string, confirmCallback: () => any, cancelCallback: () => any = null) {
            const confirmDialog = useConfirmationDialogState();

            _.assign(confirmDialog.value, {
                open: true,
                title,
                text,
                confirmCallback,
                cancelCallback,
            });
        },
    };
}
