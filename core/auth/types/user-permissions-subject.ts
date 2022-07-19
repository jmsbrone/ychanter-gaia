import { Ability } from "@casl/ability";
import { User } from "../domains/user";
import { UserAbility } from "../values/user-ability";
import { UserAction } from "./user-action";


export type UserPermissionsSubject = "all" | User;
export class UserPermissions extends Ability<[UserAction, UserAbility]> {}
