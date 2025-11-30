export interface EmailSettings {
    is_production: boolean;
    type: string;        // e.g., "SMTP"
    username: string;
    host: string;
    password: string;
    port: string | number;
    encryption: string;  // e.g., "tls" | "ssl"
    email: string;
    name: string;
    apiKey?: string
}
