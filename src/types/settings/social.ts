export interface SocialLink {
    name: string; // e.g., "Facebook", "Twitter", "LinkedIn"
    url: string; // Social media URL
    order: number; // Display order
    is_active: boolean;
}

export interface Social {
    _id: string;
    type: SocialLink[];
}