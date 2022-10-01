import { AuthAPI, AuthAPIPort } from "../core/auth/api/auth-api";
import { DIContainer } from "../core/port-manager";

export default defineNuxtRouteMiddleware(async (to, from) => {
    if (!process.server) {
        const user = useCurrentUser();

        try {
            if (!user.value) {
                const service = DIContainer.get<AuthAPI>(AuthAPIPort);
                user.value = await service.fetchCurrentUser();
            }
        } catch (error) {
            return navigateTo("/auth/login");
        }
    }
});
