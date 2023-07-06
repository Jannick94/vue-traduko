import { ref } from 'vue';

interface IUseTraduko {
    resolvedModules: Object,
    t: Function,
}

interface IMessageMap {
    [key: string]: Function,
}

const messageMap: any = {
    invoices: {
        nl: () => import('@/i18n/nl/invoices'),
        en: () => import('@/i18n/en/invoices'),
    },
    home: {
        nl: () => import('@/i18n/nl/home'),
        en: () => import('@/i18n/en/home'),
    }
};

function getObjectReferenceByPath(obj: any, path: string): string {
    return path.split('.').reduce((prev, key) => {
        return prev[key];
    }, obj)
}

export function useTraduko(defaultLocale = 'nl')  {
    const locale = ref(defaultLocale);
    const resolvedModules = ref();
    const mappedModules = ref();
    const loadedModules = ref([]);

    async function initializeTranslations(moduleNames: string[]) {
        loadedModules.value = moduleNames;

        const modulePromises = moduleNames.map(async (name) => {
            try {
                const moduleResult = await messageMap[name][locale.value]();

                return {
                    name,
                    moduleResult,
                };
            } catch {
                throw new Error(`[vue-traduko]: translation module with name: '${name}' could not be found in config.`);
            }
        });

        resolvedModules.value = await Promise.all(modulePromises);

        mappedModules.value = resolvedModules.value.reduce((prev: any, resolvedModule: any) => {
            prev[resolvedModule.name] = resolvedModule.moduleResult.default;

            return prev;
        }, {});
    }

    function setLocale(localeKey: string) {
        locale.value = localeKey;

        initializeTranslations(loadedModules.value);
    }

    function t(path: string, params: any = {}): string {
        const [moduleName, ...rest] = path.split('.');
        const paramKeys = Object.keys(params);

        try {
            let textResult = getObjectReferenceByPath(
                mappedModules.value[moduleName],
                rest.join('.'),
            );

            if (paramKeys.length > 0) {
                const mappedKeys = paramKeys.map((key) => {
                    return `{${key}\\?*}`;
                });
                const regex = new RegExp(mappedKeys.join('|'), 'gi');

                textResult = textResult.replace(regex, (matched) => {
                    return params[matched.replace(/[{}?]/g, '')];
                });
            }

            return textResult;
        } catch {
            console.warn(`[vue-traduko]: translation with path: '${path}' could not be found.`);

            return path;
        }
    }

    return {
        locale,
        resolvedModules,
        initializeTranslations,
        setLocale,
        t,
    };
}
