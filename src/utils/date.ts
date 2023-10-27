import _ from 'lodash';
import type { Moment } from "moment";
import { format as fmt } from 'date-fns';
import { de } from 'date-fns/locale'

import { allSupportedLocales } from 'moment-utl';

export const DAY_FORMAT = 'd'
export const EVENT_FORMAT = 'DD-MM-YYYY'
export const MONTH_FORMAT = 'MMMM yyyy'
export const DISPLAY_FORMAT = 'dd.M.yyyy'

interface CalendarDay {
    moment: Moment;
    num: number,
    in_month: boolean,
}

export const calendarDays = (date: Moment): CalendarDay[] => {
    const first = date.clone().startOf('month')
    const last  = first.clone().endOf('month')
    const out = calendarDays2(first, last)
    return [ 
        ...mapCalendarDays(weekDaysBefore(out[0])),
        ...mapCalendarDays(out, true),
        ...mapCalendarDays(weekDaysAfter(out[out.length - 1])),
    ]
}

export const formatMoment = (date: Moment, lang: string, format: string): string => {
    let locale
    switch(lang) {
        case 'de': locale = de; break
        default: locale = undefined
    }
    return fmt(date.toDate(), format, { locale: locale })
}

export const testLocale = (locale) => {
    return _.includes(allSupportedLocales(), locale)
}

const weekDaysBefore = (date: Moment): Moment[] => {
    const wd: number = date.weekday()
    return wd > 0 ? calendarDays2(
        date.clone().subtract(wd, 'd'), 
        date.clone().subtract(1, 'd')
    ) : []
}
const weekDaysAfter = (date: Moment): Moment[] => {
    const wd: number = date.weekday()
    return wd > 0 ? calendarDays2(
        date.clone().add(1, 'd'), 
        date.clone().add(7 - wd - 1, 'd')
    ) : []
}
const mapCalendarDays = (dates: Moment[], in_month: boolean = false, lang = 'en'): CalendarDay[] => {
    return _.map(dates, (m: Moment) => ({
        moment: m,
        num: formatMoment(m, lang, DAY_FORMAT),
        in_month,
    }))
}
const calendarDays2 = (first: Moment, last: Moment): Moment[] => {
    first = first.clone()
    last  = last.clone()
    let out: Moment[] = first.isSameOrBefore(last) ? [first] : []
    while (first.isBefore(last)) {
        out = [...out, first = first.clone().add(1, 'd')]
    }
    return out
}
