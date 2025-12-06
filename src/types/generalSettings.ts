export interface GeneralSettings {
    name: string;
    tagline: string;
    dark_logo: string;
    white_logo: string;
    favicon: string;
    email: string;
    address: string;
    phone: string;
    timezone: string;
    default_country: string;
    default_currency: string;
    default_language: string;
    currency_symbol?: string;
    date_format: string;
    time_format: string;
    google_key: string;
    fee: string;
    tax: string;
    api_base_url: string;
    background_location_update_interval: number;
    driver_online_location_update_interval: number;
    max_distance: number;
    prebooking_time: number;
}