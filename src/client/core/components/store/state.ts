import { UserAbility } from "client/modules/auth/values/user-ability";
import { PlainObject } from "../../../types/basic";

export interface StoreState {
    /**
     * Root module
     */
    root: {
        user: {
            permissions: UserAbility;
        };
        error: string;
        error_counter: number;
    };
    /**
     * Editor module
     */
    editor: PlainObject;
}
