<template>
    <div style="display: flex; flex-direction: column;">
        <p>{{ t('home.hero_title') }}</p>
    </div>
</template>

<script lang="ts">
    import { useTraduko } from '@/composables/use-traduko';

    export default {
        name: 'child-component',
        async setup() {
            const { t, initializeTranslations } = useTraduko();

            await initializeTranslations(['home']);

            return {
                t,
            };
        },
    };
</script>
