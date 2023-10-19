<script lang="ts">

    import { marked } from 'marked'

    export let data
    let html = ''

    $: {
        let content = data || ''
        content = content.replace(/^[^#]*?#{1,6}|\n#{1,6}/g, '####')
        html = marked.parse(content)
    }

</script>

<div class="event">
{@html html}
</div>

<style>

    * {
        color: white;
    }
    .event {
        font-family: monospace;
        padding: .8rem 0 .5rem;
        border-top: 1px solid white;
    }
    h6 {
        font-size: 12rem;
        margin: 0;
        color: red;
    }

</style>