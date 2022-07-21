type MenuItem = {
    path: string;
    icon: string;
    title: string;
};
type MenuGroup = {
    name?: string;
    items: MenuItem[];
};
type MenuGroups = {
    [key: string]: MenuGroup;
};

const useLeftMenuState = () =>
    useState("adminLeftMenu", () => {
        return {
            groups: {
                main: {
                    items: [
                        {
                            path: "/admin",
                            icon: "home",
                            title: "Home",
                        },
                    ],
                },
                modules: {
                    name: "Modules",
                    items: [
                        {
                            path: "/admin/content",
                            icon: "content",
                            title: "Content",
                        },
                    ],
                },
                settings: {
                    items: [
                        {
                            path: "/admin/settings",
                            icon: "settings",
                            title: "Settings",
                        },
                    ],
                },
            } as MenuGroups,
        };
    });

export function useAdminLeftMenu() {
    const leftMenu = useLeftMenuState();

    const menuController = {
        addGroup(code: string, name: string = undefined) {
            leftMenu.value.groups[code] = { items: [], name };
        },
        addToGroup(code: string, item: MenuItem) {
            leftMenu.value.groups[code].items.push(item);
        },
        getItems(): MenuGroups {
            return leftMenu.value.groups;
        },
    };

    return menuController;
}
