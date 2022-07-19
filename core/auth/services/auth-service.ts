import { User } from "../domains/user";
import { Query } from "@ychanter/graphql-client";
import { GraphQLService } from "../../components/graphql/graphql-service";
import _ from "lodash";
import { UserLoginDto } from "../dto/login.dto";
import { AxiosRequest } from "../../components/axios-request";
import { Storage } from "../../components/storage";
import { DIContainer } from "../../port-manager";

/**
 * Service for authentication and authorization logic
 */
export class AuthService {
    /**
     * Attempt to login with provided credentials
     * @param login_dto
     * @returns
     */
    public async login(login_dto: UserLoginDto): Promise<boolean> {
        try {
            const request = DIContainer.get<AxiosRequest>("AxiosRequest");
            const response_data = await request.post("/auth/login", login_dto);
            Storage.put("jwt-auth-token", response_data.data.access_token);
            return true;
        } catch (error) {
            return false;
        }
    }

    public async fetchCurrentUser(): Promise<User> {
        try {
            const service = DIContainer.get<GraphQLService>("GraphQLService");
            const query_result = await service.get(
                new Query("current_user").take("isSystemAdmin,isAdmin,isOperator,created_at,updated_at,id")
            );
            if (query_result === null) {
                throw new Error("Unauthorized");
            }
            const user = new User();
            _.assign(user, query_result);
            return user;
        } catch (error) {
            throw new Error(error);
        }
    }
}
