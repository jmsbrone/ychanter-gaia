import { RequestExecutionClientException, RequestExecutionServerException } from "../../types/requests";

export class GraphQLClientException extends RequestExecutionClientException {}
export class GraphQLServerException extends RequestExecutionServerException {}
