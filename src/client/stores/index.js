/**
 * @summary
 *
 * Root store. Defined here instead of separate store along with others
 * due to nuxtServerInit action not working with vuex-module-decorators.
 */

import { initStoreFromServer } from "client/helpers/init-helper";

export const actions = {
    nuxtServerInit({ commit }, { req, res }) {
        initStoreFromServer(commit, req, res);
    },
};
