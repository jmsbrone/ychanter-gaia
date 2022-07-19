export class DIContainer {
    protected static map: { [key: string]: any } = {};

    public static register<T>(port: string, adapter: T): void {
        this.map[port] = adapter;
    }

    public static get<T>(port: string): T {
        return this.map[port];
    }
}
