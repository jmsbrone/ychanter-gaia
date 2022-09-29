import { AuthAPI } from "../api/auth-api";
import { User } from "../domains/user";
import { UserLoginDto } from "../dto/login.dto";

export class AuthServiceMock implements AuthAPI {
    async login(login_dto: UserLoginDto): Promise<boolean> {
        return true;
    }

    async fetchCurrentUser(): Promise<User> {
        const user = new User();
        user.id = 1;
        user.login = "test";

        return user;
    }
}
