import { Ability } from "@casl/ability";
import { User } from "client/modules/auth/domains/user";
import { UserAbility } from "client/modules/auth/values/user-ability";
import { UserAction } from "common/modules/auth/types/user-action";

export type UserPermissionsSubject = "all" | User;
export class UserPermissions extends Ability<[UserAction, UserAbility]> {}
