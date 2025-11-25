export interface GeneralSettings {
    name: string;
    logo: string;
    email: string;
    address: string;
    phone: string;
    timezone: string;
    default_country: string;
    default_currency: string;

    date_format: {
        text: string;
        value: string;
    };

    time_format: {
        text: string;
        value: string;
    };

    google_key: string;
    fee: string;
    tax: string;
    api_base_url: string;

    background_location_update_interval: number;
    driver_online_location_update_interval: number;
    max_distance: number;
    prebooking_time: number;
}