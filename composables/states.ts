import _ from "lodash";

export const useCurrentUser = () => useState("currentUser", () => null);

export const useAdminFooterState = () =>
    useState("adminFooter", () => {
        return {
            components: [],
            show: false,
        };
    });

export function useAdminFooter() {
    const adminFooterState = useAdminFooterState();

    return {
        addComponent(name: string) {
            if (!_.includes(adminFooterState.value.components, name)) {
                adminFooterState.value.components.push(name);
            }
        },
        getComponents() {
            return adminFooterState.value.components;
        },
        isVisible() {
            return adminFooterState.value.show;
        },
        hide() {
            adminFooterState.value.show = false;
        },
        show() {
            adminFooterState.value.show = true;
        },
    };
}
