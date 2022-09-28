import { User } from "../domains/user";
import { UserLoginDto } from "../dto/login.dto";

export const AuthAPIPort = "AuthAPI";

/**
 * Core port for authentication and authorization logic.
 */
export interface AuthAPI {
    /**
     * Attempt to login with provided credentials
     * @param login_dto
     * @returns
     */
    login(login_dto: UserLoginDto): Promise<boolean>;

    /**
     * Returns current user instance.
     */
    fetchCurrentUser(): Promise<User | null>;
}
