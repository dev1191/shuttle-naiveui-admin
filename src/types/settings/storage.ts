export interface StorageSettings {
    name: string
    cloudinary: CloudinarySettings
    spaces: SpacesSettings
}

export interface CloudinarySettings {
    cloud_name: string
    api_key: string
    api_secret: string
}

export interface SpacesSettings {
    access_key: string
    secret_key: string
    region: string
    endpoint: string
    bucket: string
}