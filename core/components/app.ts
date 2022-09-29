/**
 * Singleton class for the main application.
 */
export class Application {
    /**
     * Instance of current application.
     */
    private static _instance: Application = null;

    /**
     * Returns singleton instance of the application.
     * @returns
     */
    public static getInstance(): Application {
        if (this._instance === null) {
            this._instance = new Application();
        }

        return this._instance;
    }

    /**
     * Initializes application
     */
    public init() {}
}
