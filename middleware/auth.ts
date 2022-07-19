import { AuthService } from "../core/auth/services/auth-service";

export default defineNuxtRouteMiddleware(async (to, from) => {
    if (!process.server) {
        const user = useCurrentUser();

        try {
            if (!user.value) {
                const service = new AuthService();
                user.value = await service.fetchCurrentUser();
            }
        } catch (error) {
            return navigateTo("/auth/login");
        }
    }
});
