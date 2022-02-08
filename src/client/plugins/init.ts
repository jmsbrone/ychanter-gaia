import { AxiosRequest } from "client/core/components/axios-request";
import { GraphQLAxiosRequest } from "client/core/components/graphql/graphql-axios-request";
import { GraphQLService } from "client/core/components/graphql/graphql-service";
import { ClientStorage } from "client/core/components/storage/client-storage";
import { VuexStore } from "client/core/components/store/vuex-store";
import { API_URL_PATH } from "common/constants";
import "client/core/custom-vue-injections";

export default function ({ $axios, store }, inject) {
    const client_store = new VuexStore(store);
    const storage = ClientStorage.getInstance();
    const graphql_service = new GraphQLService(new GraphQLAxiosRequest($axios));
    const axios_request = new AxiosRequest($axios, API_URL_PATH);

    storage.setStore(client_store);
    storage.setGraphQLService(graphql_service);
    storage.setAxiosRequest(axios_request);

    client_store.dispatch("settings/init");

    inject("yc_graphql_service", graphql_service);
    inject("yc_axios_request", axios_request);
    inject("yc_storage", storage);
}
