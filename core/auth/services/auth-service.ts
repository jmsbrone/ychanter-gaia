import { User } from "../domains/user";
import { Query } from "@ychanter/graphql-client";
import { GraphQLService, GraphQLServicePort } from "../../components/graphql/graphql-service";
import _ from "lodash";
import { UserLoginDto } from "../dto/login.dto";
import { Storage } from "../../components/storage";
import { DIContainer } from "../../port-manager";
import { AxiosRequest } from "../../components/axios/axios-request";
import { JWT_TOKEN_COOKIE } from "../../constants";
import { AuthAPI } from "../api/auth-api";
import { AxiosRequestPort } from "../../components/axios/interface";

/**
 * Service for authentication and authorization logic
 */
export class AuthService implements AuthAPI {
    /**
     * Attempt to login with provided credentials
     * @param login_dto
     * @returns
     */
    public async login(login_dto: UserLoginDto): Promise<boolean> {
        try {
            const request = DIContainer.get<AxiosRequest>(AxiosRequestPort);
            const response_data = await request.post("/auth/login", login_dto);
            Storage.put(JWT_TOKEN_COOKIE, response_data.data.access_token);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    public async fetchCurrentUser(): Promise<User> {
        try {
            const service = DIContainer.get<GraphQLService>(GraphQLServicePort);
            const query_result = await service.get(new Query("current_user").take("id"));
            if (query_result === null) {
                throw new Error("Unauthorized");
            }
            const user = new User();
            _.assign(user, query_result);

            return user;
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
    }
}
