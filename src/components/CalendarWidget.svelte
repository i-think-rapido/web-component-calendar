<script lang="ts">
    import _ from 'lodash';
    import type { Moment } from "moment";
    import moment from 'moment';
    import CalendarEvent from './CalendarEvent.svelte';
    import { calendarDays, EVENT_FORMAT, MONTH_FORMAT, formatMoment } from '../utils/date';

    export let date = moment()
    export let calendar = {}
    export let lang

    let selectedDay
    let eventDays = []
    let eventData = []

    $: {
        selectedDay = date.startOf('day')
        eventDays = _.keys(calendar.events)
    }

    const weekDayNames = (): string[] => {
        return _.range(7).map(n => `${formatMoment(selectedDay.clone().weekday(n), lang, 'E')}`)
    }
    const monthName = (date: Moment): string => {
        moment.locale('de')
        return formatMoment(date, lang, MONTH_FORMAT)
    }
    const isCurrentDay = (date: Moment): boolean => {
        return moment().startOf('day').isSame(date)
    }
    const hasEvents = (date: Moment): boolean => {
        return _.includes(eventDays, date.format(EVENT_FORMAT))
    }
    const displayEvents = (date: Moment) => {
        eventData = calendar.events[date.format(EVENT_FORMAT)] || []
    }
    const hideEvents = () => {
        eventData = []
    }
</script>

<div class="container">
    <header>
        <div>{monthName(selectedDay)}</div>
    </header>
    <main>
        <div class="week-day">
            {#each weekDayNames() as name}
                <div>
                    <span>{name}</span>
                </div>
            {/each}
        </div>
        <div class="picker">
            {#each calendarDays(selectedDay) as day}
                <div on:mouseover={_ => displayEvents(day.moment)} on:mouseout={hideEvents}>
                    <span 
                        class:in-month={day.in_month}
                        class:is-current-day={isCurrentDay(day.moment)}
                        class:has-events={hasEvents(day.moment)}
                        >{day.num}</span>
                </div>
            {/each}
        </div>
    </main>
    <footer>
        {#if !_.isEmpty(eventData)}
            <h5>{calendar.header}</h5>
            {#each eventData as data}
                <CalendarEvent {data}/>
            {/each}
        {/if}
    </footer>
</div>

<style lang="scss">

    * {
        box-sizing: border-box;
    }

    $padding: 1rem;
    $width: 320px;
    $size: calc(($width - 2*$padding) / 7);
    $header-bg: #33c;
    .container {
        width: $width;
        z-index: 10000;
        flex-wrap: wrap;
    }
    header {
        height: 100px;
        width: $width;
        font-size: 1.5rem;
        text-align: center;
        background-color: $header-bg;
        color: white;
        padding: $padding;
        border-radius: 10px 10px 0 0;
        span {
            text-transform: uppercase;
            font-size: .6rem;
        }
        div {
            margin-top: 1.4rem;
        }
    }
    footer {
        min-height: 20px;
        width: $width;
        background-color: $header-bg;
        color: white;
        padding: $padding * 2;
        border-radius: 0 0 10px 10px;
    }
    h5 {
        font-size: 1.5rem;
        margin: .5rem 0;
    }
    div.picker, div.week-day, div.buttons {
        display: flex;
        flex-wrap: wrap;
        background-color: white;
        width: $width;
        padding: $padding;
    }
    div.picker, div.week-day {
        &>div {
            display: table;
            width: $size;
            height: $size;
            border-spacing: 4px;
            &>span {
                display: table-cell;
                text-align: center;
                vertical-align: middle;
                color: gray;
                padding-top: 3px;
                border-radius: calc($size / 2);
                &.in-month {
                    color: black;
                }
            }
        }
    }
    div.picker {
        &>div {
            &>span {
                &:hover {
                    background-color: lightgray;
                    color: white;
                }
                &.in-month {
                    color: black;
                    &:hover {
                        background-color: lightgray;
                        color: white;
                    }
                }
                &.is-current-day {
                    background-color: gold;
                    color: black;
                    &:hover {
                        background-color: gold;
                    }
                }
                &.has-events {
                    background-color: green;
                    color: white;
                    &:hover {
                        background-color: green;
                    }
                }
                &.is-current-day.has-events {
                    background-color: gold;
                    border: 3px solid green;
                    color: black;
                    &:hover {
                        background-color: gold;
                    }
                }
            }
        }
    }

</style>


