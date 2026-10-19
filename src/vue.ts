import { defineComponent, h, onMounted, ref, useId, watch, type PropType } from 'vue';
import { configureWidget, loadPickupSelect, TAG_NAME } from './index';
import type { PickupPoint, WidgetOverrides } from './types';

export type * from './types';

let counter = 0;

export const PickupSelect = defineComponent({
    name: 'PickupSelect',
    props: {
        widgetKey: { type: String, required: true },
        apiKey: { type: String, required: true },
        id: String,
        selectedPointId: Number,
        selectedCountryCode: String,
        selectedPostalCode: String,
        origin: String,
        configure: Function as PropType<(settings: WidgetOverrides) => void>,
        height: { type: [String, Number] as PropType<string | number>, default: 600 },
    },
    emits: {
        select: (_point: PickupPoint | null) => true,
        error: (_error: Error) => true,
    },
    setup(props, { emit }) {
        const el = ref<HTMLElement | null>(null);
        const ready = ref(false);
        // useId exists from Vue 3.5; older versions fall back to a counter
        const elementId = props.id ?? `pickup-select-${useId?.() ?? ++counter}`;
        const handler = (e: Event) => emit('select', (e as CustomEvent).detail.selectedPickupPoint);

        watch(el, (current, previous) => {
            previous?.removeEventListener('onSelectPickupPoint', handler);
            current?.addEventListener('onSelectPickupPoint', handler);
        });

        // the element is rendered only after the overrides are set, because the widget reads them once, on mount
        onMounted(() => {
            loadPickupSelect(props.origin)
                .then(() => {
                    if (props.configure) configureWidget(props.widgetKey, props.configure);
                    ready.value = true;
                })
                .catch((e: Error) => emit('error', e));
        });

        return () =>
            h('div', { style: { height: typeof props.height === 'number' ? `${props.height}px` : props.height } }, [
                ready.value
                    ? h(TAG_NAME, {
                          ref: el,
                          id: elementId,
                          'widget-key': props.widgetKey,
                          'api-key': props.apiKey,
                          'selected-point-id': props.selectedPointId,
                          'selected-country-code': props.selectedCountryCode,
                          'selected-postal-code': props.selectedPostalCode,
                      })
                    : null,
            ]);
    },
});

export default PickupSelect;
