export default defineNuxtPlugin((app) => {
    if (process.server) {
        return;
    }
    const leftMenu = useAdminLeftMenu();
    leftMenu.addToGroup("modules", {
        path: "/admin/web-pages",
        icon: "webpage_tree",
        title: "Web pages",
    });
});
