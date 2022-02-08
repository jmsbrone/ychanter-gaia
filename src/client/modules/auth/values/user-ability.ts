/**
 * @module Modules.Auth.Values.UserAbility
 */
import { Ability } from "@casl/ability";
import { UserAction } from "common/modules/auth/types/user-action";
import { UserPermissionsSubject } from "../types/user-permissions-subject";

/**
 * User ability type for general actions to any domain.
 * Based on CASL ability object (from casl package).
 */
export type UserAbility = Ability<[UserAction, UserPermissionsSubject]>;
