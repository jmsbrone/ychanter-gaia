/**
 * @module Lib.DateFormatter
 */
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(localizedFormat);

const DATE_FORMATS = {
    LOCALIZED: {
        // 8:02 PM
        SHORT_TIME: "LT",
        // 8:02:18 PM
        SHORT_TIME_WITH_SECONDS: "LTS",
        // 08/16/2018
        SHORT_DATE: "L",
        // August 16, 2018
        FULL_DATE_NUMBERS: "LL",
        // August 16, 2018 8:02 PM
        FULL_DATE_WITH_TIME: "LLL",
        // Thursday, August 16, 2018 8:02 PM
        FULL_DATE_WITH_TIME_WITH_WEEKDAY: "LLLL",
        // 8/16/2018
        FULL_DATE_NUMBERS_WITHOUT_LEADING_ZEROES: "l",
        // Aug 16, 2018
        SHORT_MONTH_FULL_DATE: "ll",
        // Aug 16, 2018 8:02 PM
        SHORT_MONTH_FULL_DATE_WITH_TIME: "lll",
        // Thu, Aug 16, 2018 8:02 PM
        SHORT_MONTH_FULL_DATE_WITH_TIME_WITH_WEEKDAY: "llll",
    },
    // 16-08-2021 20:02:30
    LOG: "DD-MM-YYYY HH:mm:ss",
};

export class DateFormatter {
    protected static getDayjsObjectFromInput(date: any): dayjs.Dayjs {
        return dayjs(date);
    }

    public static toShortLocalDateTime(date: any): string {
        return this.getDayjsObjectFromInput(date).format(DATE_FORMATS.LOCALIZED.SHORT_MONTH_FULL_DATE_WITH_TIME);
    }

    /**
     * Returns a string containing the date formatted according to passed format
     * @param date
     * @param format
     * @returns
     */
    public static format(date: Date, format: string): string {
        return this.getDayjsObjectFromInput(date).format(format);
    }

    /**
     * Returns date formatted for logging
     * @param date
     * @returns
     */
    public static toLogFormat(date?: Date): string {
        return this.format(date, DATE_FORMATS.LOG);
    }
}
