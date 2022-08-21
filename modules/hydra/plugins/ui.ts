export default defineNuxtPlugin((app) => {
    if (process.server) {
        return;
    }
    const leftMenu = useAdminLeftMenu();
    leftMenu.addToGroup("settings", {
        path: "/admin/hydra",
        icon: "hydra_icon",
        title: "Hydra",
    });
});
