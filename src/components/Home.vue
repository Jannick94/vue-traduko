<template>
    <div style="display: flex; flex-direction: column;">
        <p>{{ t('invoices.nested.with.text') }}</p>
        <p>{{ t('invoices.foo') }}</p>
        <p>{{ t('home.hero_title') }}</p>
    </div>
</template>

<script lang="ts">
    import { useTraduko } from '@/composables/use-traduko';

    export default {
        name: 'home-component',
        async setup() {
            const { t } = await useTraduko(['invoices']);

            return {
                t,
            };
        },
    };
</script>
