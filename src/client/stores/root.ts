import { User } from "client/modules/auth/domains/user";
import { Module, Mutation, VuexModule } from "vuex-module-decorators";

@Module({
    name: "root",
    namespaced: true,
    stateFactory: true,
})
export class RootStore extends VuexModule {
    left_menu = false;
    user: User = null;
    error: string = null;
    // Counter is used to determine that error was changed.
    // This is useful in case of repeating same errors.
    error_counter = 0;

    @Mutation
    openLeftMenu() {
        this.left_menu = true;
    }

    @Mutation
    closeLeftMenu() {
        this.left_menu = false;
    }

    @Mutation
    setUser(user: User) {
        this.user = user;
    }

    @Mutation
    setError(error: string) {
        this.error = error;
        this.error_counter++;
    }
}
