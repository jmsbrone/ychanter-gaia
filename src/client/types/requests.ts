/**
 * Enum with possible results for execution of any request to the server.
 * This can be used for any type of request, not just http ones.
 */
export enum RequestExecutionResultType {
    SUCCESS = 2,
    REDIRECT = 3,
    CLIENT_ERROR = 4,
    SERVER_ERROR = 5,
}

/**
 * Generic error types that will be
 */
export type RequestErrorType = Error;

/**
 * Result of executed request to the server
 */
export class RequestExecutionResult {
    /**
     * Execution errorss
     */
    protected errors: string[] = [];
    /**
     * Requsted data
     */
    protected data: any = null;
    /**
     * Query execution status
     */
    protected execution_result: RequestExecutionResultType = null;

    /**
     * Creates new result object
     * @param data
     * @param errors
     */
    public constructor(
        data: any,
        errors: string[] = [],
        execution_result: RequestExecutionResultType = RequestExecutionResultType.SUCCESS
    ) {
        this.data = data;
        this.errors = errors;
        this.execution_result = execution_result;
    }

    /**
     * Returns errors that happend during request execution
     * @returns
     */
    public getErrors(): string[] {
        return this.errors;
    }

    /**
     * Returns request result data
     * @returns
     */
    public getData(): any {
        return this.data;
    }

    /**
     * Returns true if query was executed successfully
     * @returns
     */
    public isSuccess(): boolean {
        return this.execution_result === RequestExecutionResultType.SUCCESS;
    }

    /**
     * Returns true if error happend because of client data
     * @returns
     */
    public isClientError(): boolean {
        return this.execution_result === RequestExecutionResultType.CLIENT_ERROR;
    }

    /**
     * Returns true if error happened server-side
     * @returns
     */
    public isServerError(): boolean {
        return this.execution_result === RequestExecutionResultType.SERVER_ERROR;
    }
}

export class RequestExecutionClientException extends Error {}
export class RequestExecutionServerException extends Error {}
