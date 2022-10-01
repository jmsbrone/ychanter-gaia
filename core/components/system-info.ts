/**
 * Global instance to retrieve information about the system.
 */
export class SystemInfo {
    /**
     * Whether the system is running detached from the rest of the services.
     */
    public static isIsolated: boolean = false;

    /**
     * Whether the system is running in production mode.
     */
    public static isProductionMode: boolean = false;

    /**
     * Whether application is currently running on server side.
     * If false - client side.
     */
    public static isServer: boolean

    /**
     * Privating the constructor to prevent instantiating of this class.
     */
    private constructor() {}
}
