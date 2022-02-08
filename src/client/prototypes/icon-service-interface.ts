/**
 * Interface that all icon services are required to implement
 * in order to work properly.
 *
 * @module Prototypes.IconServiceInterface
 */

export interface IconServiceInterface {
    getIcon(name: string): any;
}
