interface IUseTraduko {
    resolvedModules: Object,
    t: Function,
}

interface IMessageMap {
    [key: string]: Function,
}

const messageMap: IMessageMap = {
    invoices: () => import('@/i18n/nl/invoices'),
    home: () => import('@/i18n/nl/home'),
};

function getObjectReferenceByPath(obj: any, path: string): string {
    return path.split('.').reduce((prev, key) => {
        return prev[key];
    }, obj)
}

export async function useTraduko(moduleNames: string[]): Promise<IUseTraduko> {
    const modulePromises = moduleNames.map(async (name) => {
        try {
            const moduleResult = await messageMap[name]();

            return {
                name,
                moduleResult,
            };
        } catch {
            throw new Error(`[vue-traduko]: translation module with name: '${name}' could not be found in config.`);
        }
    });

    const resolvedModules = await Promise.all(modulePromises);
    const mappedModules = resolvedModules.reduce((prev: any, resolvedModule) => {
        prev[resolvedModule.name] = resolvedModule.moduleResult.default;

        return prev;
    }, {});

    function t(path: string, params: any = {}): string {
        const [moduleName, ...rest] = path.split('.');
        const paramKeys = Object.keys(params);

        try {
            let textResult = getObjectReferenceByPath(
                mappedModules[moduleName],
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
        resolvedModules,
        t,
    };
}
