export declare enum LogLevel {
    ERROR = 0,
    WARN = 1,
    INFO = 2,
    DEBUG = 3
}
export declare class Logger {
    private static level;
    static setLevel(level: LogLevel): void;
    static debug(message: string, ...args: any[]): void;
    static info(message: string, ...args: any[]): void;
    static success(message: string, ...args: any[]): void;
    static warn(message: string, ...args: any[]): void;
    static error(message: string, ...args: any[]): void;
    static progress(message: string): void;
    static progressEnd(success?: boolean): void;
}
//# sourceMappingURL=logger.d.ts.map