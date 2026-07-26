export declare class PostgresNotificationListenerService {
    private client;
    private isRunning;
    private lastNotificationTime;
    private reconnectTimer;
    start(): Promise<void>;
    stop(): Promise<void>;
    private connectAndListen;
    private scheduleReconnect;
}
export declare const postgresListenerService: PostgresNotificationListenerService;
