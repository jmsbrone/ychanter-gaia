import _ from "lodash";

export const useCurrentUser = () => useState("currentUser", () => null);

export function useAdminFooter() {
    const components = [];
    let show = false;

    return {
        addComponent(name: string) {
            if (!_.has(components, name)) {
                components.push(name);
            }
        },
        getComponents() {
            return components;
        },
        isVisible() {
            return show;
        },
        hide() {
            show = false;
        },
        show() {
            show = true;
        },
    };
}
