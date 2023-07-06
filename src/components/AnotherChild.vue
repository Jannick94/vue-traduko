<template>
    <div>{{ t('home.hero_title') }}</div>
</template>

<script lang="ts">
    import { useTraduko } from '@/composables/use-traduko';

    export default {
        name: 'another-child',
        async setup() {
            const { t, initializeTranslations } = useTraduko();

            await initializeTranslations(['home']);

            return {
                t,
            };
        },
    }
</script>
