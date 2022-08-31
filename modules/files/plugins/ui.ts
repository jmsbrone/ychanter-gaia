export default defineNuxtPlugin((app) => {
    if (process.server) {
        return;
    }
    const leftMenu = useAdminLeftMenu();
    leftMenu.addToGroup("modules", {
        path: "/admin/content",
        icon: "content",
        title: "Content",
    });
});
