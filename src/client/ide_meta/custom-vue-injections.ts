import { AxiosRequest } from "client/core/components/axios-request";
import { GraphQLService } from "client/core/components/graphql/graphql-service";
import { ClientStorage } from "client/core/components/storage/client-storage";

declare module "vue/types/vue" {
    interface Vue {
        $yc_graphql_service: GraphQLService;
        $yc_axios_request: AxiosRequest;
        $yc_storage: ClientStorage;
    }
}
