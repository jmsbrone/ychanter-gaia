import { RequestExecutionClientException, RequestExecutionServerException } from "client/types/requests";

export class GraphQLClientException extends RequestExecutionClientException {}
export class GraphQLServerException extends RequestExecutionServerException {}
