<script lang="ts">
    import _ from 'lodash';
    import type { Moment } from "moment";
    import moment from 'moment';
    import CalendarEvent from './CalendarEvent.svelte';
    import { calendarDays, EVENT_FORMAT, MONTH_FORMAT, DISPLAY_FORMAT, formatMoment } from '../utils/date';

    export let date = moment()
    export let calendar = {}
    export let lang
    export let visibility
    export let id

    let selectedDay
    let displayedDay
    let days
    let eventDays = []
    let eventData = []

    $: {
        selectedDay = date.startOf('day')
        eventDays = _.keys(calendar.events)
        days = calendarDays(selectedDay)
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
        const result = calendar.events[date.format(EVENT_FORMAT)]
        if (!!result) {
            displayedDay = date
            eventData = result || []
            showEvents()
        }
    }
    const showEvents = () => {
        visibility = _.map(visibility, (_, idx) => id == idx)
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
            {#each days as day}
                <div on:mouseover={_ => displayEvents(day.moment)}>
                    <span 
                        class:in-month={day.in_month}
                        class:is-current-day={isCurrentDay(day.moment)}
                        class:has-events={hasEvents(day.moment)}
                        >{day.num}</span>
                </div>
            {/each}
            {#if days.length <= 35}
                <div><span>&nbsp;</span></div>
            {/if}
        </div>
    </main>
    <footer>
        {#if visibility[id]}
            <h5>{calendar.header}</h5>
            <p>{formatMoment(displayedDay, lang, DISPLAY_FORMAT)}</p>
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

    $padding:       1rem;
    $gap:           .5rem;
    $cell-gap:      .1rem;
    $cell-size:     2.4rem - 2 * $cell-gap;
    $width-inner:   $cell-size * 7;
    $width-outer:   $width-inner + 2 * $padding;

    $header-col:    white;
    $header-col-bg: #33c;
    $main-col:      #333;
    $main-col-bg:   white;

    .container {
        z-index: 10000;;
        flex-wrap: wrap;
    }
    header, main, footer {
        width: $width-outer;
    }
    main {
        padding: .5rem 0;
        background: $main-col-bg;
    }
    header {
        display: table;
        height: 100px;
        font-size: 1.5rem;
        text-align: center;
        background-color: $header-col-bg;
        color: $header-col;
        padding: $padding;
        border-radius: 10px 10px 0 0;
        div {
            display: table-cell;
            font-size: 1rem;
            vertical-align: middle;
        }
    }
    footer {
        min-height: 20px;
        background-color: $header-col-bg;
        color: $header-col;
        padding: $padding * 2;
        border-radius: 0 0 10px 10px;
        h5 {
            font-size: 1rem;
            margin: .5rem 0;
        }
    }
    div.picker, div.week-day {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        background-color: $main-col-bg;
        font-size: .8rem;
    }
    div.picker, div.week-day {
        &>div {
            display: table;
            border-spacing: $cell-gap;
            &>span {
                display: table-cell;
                width: $cell-size;
                height: $cell-size;
                text-align: center;
                vertical-align: middle;
                color: gray;
                padding-top: 3px;
                border-radius: calc($cell-size / 2);
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


