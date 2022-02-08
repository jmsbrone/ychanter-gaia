import { Ability } from "@casl/ability";
import { User } from "client/modules/auth/domains/user";
import { UserAbility } from "client/modules/auth/values/user-ability";
import { DynamicEntity } from "client/modules/dynamic-entity/domains/dynamic-entity";
import { UserAction } from "common/modules/auth/types/user-action";

export type UserPermissionsSubject = "all" | User | DynamicEntity;
export class UserPermissions extends Ability<[UserAction, UserAbility]> {}
