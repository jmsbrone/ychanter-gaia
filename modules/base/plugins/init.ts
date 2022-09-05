import axios from "axios";
import { AxiosRequest } from "../../../core/components/axios-request";
import { GraphQLAxiosRequest } from "../../../core/components/graphql/graphql-axios-request";
import { GraphQLService } from "../../../core/components/graphql/graphql-service";
import { DIContainer } from "../../../core/port-manager";

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig();
    const SERVER_API = process.env.server ? config.backendApi : config.public.backendApi;

    const service = new GraphQLService(new GraphQLAxiosRequest(axios, SERVER_API + "/graphql"));

    DIContainer.register("AxiosRequest", new AxiosRequest(axios, SERVER_API));
    DIContainer.register("GraphQLService", service);
});
