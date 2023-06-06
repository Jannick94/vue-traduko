<template>
    <div style="display: flex; flex-direction: column; align-items: flex-start;">
        <p>{{ t('invoices.nested.with.text') }}</p>
        <p>{{ t('invoices.param', { firstname: 'Jannick', lastname: 'Berkhout' }) }}</p>
        <p v-for="item in t('invoices.list')" :key="item.name">{{ item.name }}</p>

        <child v-if="visible"></child>

        <button @click="toggleVisiblity()">
            toggle
        </button>
    </div>
</template>

<script lang="ts">
    import { ref } from 'vue';

    import Child from '@/components/Child.vue';
    import { useTraduko } from '@/composables/use-traduko';

    export default {
        name: 'home-component',
        components: {
            Child,
        },
        async setup() {
            const visible = ref(false);
            const { t } = await useTraduko(['invoices']);

            function toggleVisiblity() {
                visible.value = !visible.value;
            }

            return {
                visible,
                t,
                toggleVisiblity,
            };
        },
    };
</script>
