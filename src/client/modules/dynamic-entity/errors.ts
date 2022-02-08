import { ERROR_MESSAGE_TEMPLATE_VAR_BOUNDARY } from "common/constants";
import { ModuleError } from "common/modules/dynamic-entity/errors";

export const Errors = {
    [ModuleError.ENTITY_EXISTS]:
        `Dynamic entity with name '` +
        `${ERROR_MESSAGE_TEMPLATE_VAR_BOUNDARY}name${ERROR_MESSAGE_TEMPLATE_VAR_BOUNDARY}` +
        `' already exists.`,
};
