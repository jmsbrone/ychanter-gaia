import axios from "axios";
import { AuthAPIPort } from "../../core/auth/api/auth-api";
import { AuthService } from "../../core/auth/services/auth-service";
import { AuthServiceMock } from "../../core/auth/services/auth-service.mock";
import { AxiosRequest } from "../../core/components/axios/axios-request";
import { AxiosRequestMock } from "../../core/components/axios/axios-request.mock";
import { IAxiosRequest, AxiosRequestPort } from "../../core/components/axios/interface";
import { GraphQLAxiosRequest } from "../../core/components/graphql/graphql-axios-request";
import { GraphQLAxiosRequestMock } from "../../core/components/graphql/graphql-axios-request.mock";
import { GraphQLService, GraphQLServicePort } from "../../core/components/graphql/graphql-service";
import { GraphQLQueryRunner } from "../../core/components/graphql/types";
import { SystemInfo } from "../../core/components/system-info";
import { DIContainer } from "../../core/port-manager";

export function init() {
    const isolatedState = useState("isolated", () => SystemInfo.isIsolated);

    let queryRunner: GraphQLQueryRunner;
    let axiosRequest: IAxiosRequest;
    if (isolatedState.value) {
        queryRunner = new GraphQLAxiosRequestMock();
        axiosRequest = new AxiosRequestMock();
        DIContainer.register(AuthAPIPort, new AuthServiceMock());
    } else {
        queryRunner = new GraphQLAxiosRequest(axios);
        axiosRequest = new AxiosRequest(axios);
        DIContainer.register(AuthAPIPort, new AuthService());
    }

    const service = new GraphQLService(queryRunner);

    DIContainer.register(GraphQLServicePort, service);
    DIContainer.register(AxiosRequestPort, axiosRequest);

    const config = useRuntimeConfig();
    const SERVER_API = SystemInfo.isServer ? config.backendApi : config.public.backendApi;
    const graphQLEndpoing = SERVER_API + "/graphql";

    service.setEndpoint(graphQLEndpoing);

    const axiosRequester = DIContainer.get<AxiosRequest>(AxiosRequestPort);
    axiosRequester.setUrlPrefix(SERVER_API);
}
