import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Format a date string to a readable format
 * @param date - ISO date string or date object
 * @param showTime - Whether to include time in the output
 * @param dateFormat - Custom date format (optional)
 * @param timeFormat - Custom time format (optional)
 * @param tz - Timezone (optional)
 * @returns Formatted date string
 */
export function formatDate(
    date: string | Date | undefined | null,
    showTime = true,
    dateFormat = "DD MMM YYYY",
    timeFormat = "hh:mm A",
    tz = "Asia/Kolkata"
): string {
    if (!date) return '-';

    try {
        const parsed = dayjs(date).tz(tz);
        return parsed.format(`${dateFormat}${showTime ? ` ${timeFormat}` : ''}`);
    } catch (error) {
        console.error('Error formatting date:', error);
        return '-';
    }
}

/**
 * Format a time string (HH:mm) to a readable format
 * @param time - Time string in HH:mm format
 * @param timeFormat - Custom time format (optional)
 * @returns Formatted time string
 */
export function formatTime(
    time: string | undefined | null,
    timeFormat = "hh:mm A"
): string {
    if (!time) return '-';

    try {
        return dayjs(time, "HH:mm").format(timeFormat);
    } catch (error) {
        console.error('Error formatting time:', error);
        return '-';
    }
}

/**
 * Get formatted date using settings from auth store
 * This is a wrapper that can be used with store settings
 */
export function getFormattedDate(
    date: string | Date | undefined | null,
    showTime = true,
    settings?: {
        date_format?: string;
        time_format?: string;
        timezone?: string;
    }
): string {
    return formatDate(
        date,
        showTime,
        settings?.date_format || "DD MMM YYYY",
        settings?.time_format || "hh:mm A",
        settings?.timezone || "Asia/Kolkata"
    );
}
