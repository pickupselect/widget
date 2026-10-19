import type { WidgetOverrides } from './types';

export type * from './types';

export const DEFAULT_ORIGIN = 'https://pickupselect.com';
export const TAG_NAME = 'pickup-select';

const loading = new Map<string, Promise<void>>();

/**
 * Loads the widget from `origin` once and resolves when `<pickup-select>` is defined.
 * Only the small loader comes from npm; the widget itself is always the version currently deployed.
 */
export function loadPickupSelect(origin: string = DEFAULT_ORIGIN): Promise<void> {
    if (typeof window === 'undefined') {
        return Promise.reject(new Error('PickupSelect can only be loaded in the browser.'));
    }
    // already on the page, e.g. from a plain <script> tag
    if (customElements.get(TAG_NAME)) {
        return Promise.resolve();
    }

    const base = origin.replace(/\/+$/, '');
    let promise = loading.get(base);
    if (!promise) {
        promise = new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.src = `${base}/map-widget.js`;
            script.onerror = () => {
                loading.delete(base);
                reject(new Error(`Could not load ${script.src}`));
            };
            document.head.appendChild(script);
            customElements.whenDefined(TAG_NAME).then(() => resolve());
        });
        loading.set(base, promise);
    }
    return promise;
}

/**
 * Starts the widget's overrides from scratch and passes them to `configure`.
 * Call it after loadPickupSelect() and before the <pickup-select> element is added to the page:
 * the widget reads its overrides once, when it mounts.
 */
export function configureWidget(widgetKey: string, configure: (settings: WidgetOverrides) => void): void {
    const registry = window.PickupSelectOverrides;
    if (!registry) {
        throw new Error('PickupSelectOverrides is not available; call loadPickupSelect() first.');
    }
    // init() keeps earlier settings for the same key; a remount should not inherit them
    delete registry._instances[widgetKey];
    configure(registry.init(widgetKey));
}
