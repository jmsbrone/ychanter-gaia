/**
 * @module Modules.Auth.Services
 */
import _ from "client/core/helpers/lodash";
import { GraphQLService } from "client/core/components/graphql/graphql-service";
import { ClientStorage } from "client/core/components/storage/client-storage";
import { UserPermissions } from "client/modules/auth/types/user-permissions-subject";
import { UserLoginDto } from "common/dto/user/login.dto";
import { User } from "../domains/user";
import { Query } from "@ychanter/graphql-client";

/**
 * Service for authentication and authorization logic
 */
export class AuthService {
    constructor(protected graphql_service: GraphQLService = ClientStorage.getInstance().getGraphQLService()) {}

    /**
     * Attempt to login with provided credentials
     * @param login_dto
     * @returns
     */
    public async login(login_dto: UserLoginDto): Promise<boolean> {
        const storage = ClientStorage.getInstance();
        try {
            const request = storage.getAxiosRequest();
            const response_data = await request.post("/auth/login", login_dto);
            storage.setJWTAuthorizationToken(response_data.data.access_token);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Initializing user
     * @returns
     */
    public async initUser(): Promise<void> {
        const storage = ClientStorage.getInstance();
        const store = storage.getStore();
        if (store.getState().root.user === null) {
            return this.fetchCurrentUser();
        }
    }

    /**
     * Checks that current client was authenticated
     * @returns
     */
    public isAuthenticated(): boolean {
        return ClientStorage.getInstance().getStore().getState().root.user !== null;
    }

    protected async fetchCurrentUser() {
        try {
            const query_result = await this.graphql_service.get(
                new Query("current_user").take(
                    "isSystemAdmin,isAdmin,isOperator,created_at,updated_at,id"
                )
            );
            if (query_result === null) {
                throw new Error("Unauthorized");
            }
            const user = new User();
            _.assign(user, query_result);
            user.permissions = new UserPermissions(JSON.parse("{}"));
            ClientStorage.getInstance().getStore().commit("root/setUser", user);
        } catch (error) {
            throw new Error(error);
        }
    }
}
