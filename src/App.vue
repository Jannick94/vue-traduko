<template>
    <suspense>
        <home></home>
    </suspense>
</template>

<script lang="ts">
    import Home from '@/components/Home.vue';

    export default {
        name: 'app',
        components: {
            Home,
        },
    };
</script>
