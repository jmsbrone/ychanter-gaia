/**
 * Global instance to retrieve information about the system.
 */
export class SystemInfo {
    /**
     * Whether the system is running detached from the rest of the services.
     */
    public static isIsolated: boolean = false;

    /**
     * Privating the constructor to prevent instantiating of this class.
     */
    private constructor() {}
}
