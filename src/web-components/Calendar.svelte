<svelte:options tag="schafferei-calendar"/>

<script lang="ts">
    import _ from 'lodash'
    import yaml from 'js-yaml'
    import CalendarWidget from '../components/CalendarWidget.svelte'
    import moment from 'moment';
    import { onMount } from 'svelte';

    let visible = false
    let comp

    export let startDate = moment()
    export let num = 1
    export let lang
    export let src
    export let css

    let calendar = {}
    let months = []
    let visibility = []

    onMount(async () => {
        if (!!src) {
            if (!!lang) {
                src = src.replace(/\.yml$/, `.${lang}.yml`)
                src = src.replace(/\.yaml$/, `.${lang}.yaml`)
            }
            const content = await fetch(src).then((response) => response.text())
            calendar = yaml.load(content)
        }
        if (!!css) {
            applyStylesheet(css)
        }
    })

    $: {
        num = Math.max(1, Math.min(Math.floor(num)))
        months = _.chain(num)
                    .range()
                    .map(n => startDate.clone().add(n, 'months'))
                    .value()
        lang = lang || 'en'
        resetVisibiltiy()
    }

    const applyStylesheet = async (url: string) => {
        let shadowElement = comp
        while (shadowElement.shadowRoot === null) {
            shadowElement = shadowElement.parentNode
        }
        if (!shadowElement) {
            return
        }

        let css = await fetch(url).then((respone) => {
            return respone.text()
        })
        css += '*{overflow-wrap:break-word;}.link{color:white}'

        let el = document.createElement('style')
        el.innerText = css
        shadowElement.appendChild(el)

        visible = true
    }

    const resetVisibiltiy = (id = undefined) =>{ 
        visibility = _.map(months, (_) => false)
    }

</script>

<div web-component bind:this={comp}>
    {#if visible}
        {#each months as date, id}
            <CalendarWidget {lang} {date} {calendar} bind:visibility={visibility} {id}/>
        {/each}
    {/if}
</div>

<style>
    div[web-component] {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 1rem;
        margin: 0 auto;
    }
</style>