<template>
    <div style="display: flex; flex-direction: column; align-items: flex-start;">
        <p>{{ t('invoices.nested.with.text') }}</p>
        <p>{{ t('invoices.param', { firstname: 'Jannick', lastname: 'Berkhout' }) }}</p>
        <p v-for="item in t('invoices.list')" :key="item.name">{{ item.name }}</p>

        <child v-if="visible"></child>
        <another-child></another-child>

        <button @click="setLocale(locale === 'nl' ? 'en' : 'nl')">
            toggle
        </button>
    </div>
</template>

<script lang="ts">
    import { ref } from 'vue';

    import Child from '@/components/Child.vue';
    import AnotherChild from '@/components/AnotherChild.vue';
    import { useTraduko } from '@/composables/use-traduko';

    export default {
        name: 'home-component',
        components: {
            Child,
            AnotherChild,
        },
        async setup() {
            const visible = ref(false);
            const { t, initializeTranslations, setLocale, locale } = useTraduko();

            function toggleVisiblity() {
                visible.value = !visible.value;
            }

            await initializeTranslations(['invoices']);

            return {
                locale,
                visible,
                t,
                toggleVisiblity,
                setLocale,
            };
        },
    };
</script>
