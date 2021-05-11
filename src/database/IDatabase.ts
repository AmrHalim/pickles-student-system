export default interface IDatabase<T> {

    connect(): void;
    disconnect(): void;
    isConnected(): boolean;
    getConnectionString(): string;
}