import { useEffect, useId, useRef, useState, type CSSProperties, type Ref } from 'react';
import type * as React from 'react';
import { configureWidget, loadPickupSelect, TAG_NAME } from './index';
import type { PickupPoint, PickupSelectAttributes, PickupSelectProps } from './types';

export type * from './types';

export interface PickupSelectReactProps extends PickupSelectProps {
    onSelect?: (point: PickupPoint | null) => void;
    onError?: (error: Error) => void;
    className?: string;
    /** Style of the wrapper; the widget fills its height. Default height: 600px. */
    style?: CSSProperties;
}

export function PickupSelect({
    widgetKey,
    apiKey,
    id,
    selectedPointId,
    selectedCountryCode,
    selectedPostalCode,
    origin,
    configure,
    onSelect,
    onError,
    className,
    style,
}: PickupSelectReactProps) {
    const generatedId = useId();
    const ref = useRef<HTMLElement>(null);
    const [ready, setReady] = useState(false);
    const onSelectRef = useRef(onSelect);
    onSelectRef.current = onSelect;
    const configureRef = useRef(configure);
    configureRef.current = configure;

    // the element is rendered only after the overrides are set, because the widget reads them once, on mount
    useEffect(() => {
        let cancelled = false;
        loadPickupSelect(origin)
            .then(() => {
                if (cancelled) return;
                if (configureRef.current) configureWidget(widgetKey, configureRef.current);
                setReady(true);
            })
            .catch((e: Error) => onError?.(e));
        return () => {
            cancelled = true;
        };
    }, [origin, widgetKey]);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const handler = (e: Event) =>
            onSelectRef.current?.((e as CustomEvent).detail.selectedPickupPoint);
        el.addEventListener('onSelectPickupPoint', handler);
        return () => el.removeEventListener('onSelectPickupPoint', handler);
    }, [ready]);

    const attributes: PickupSelectAttributes = {
        id: id ?? `pickup-select-${generatedId.replace(/:/g, '')}`,
        'widget-key': widgetKey,
        'api-key': apiKey,
        'selected-point-id': selectedPointId,
        'selected-country-code': selectedCountryCode,
        'selected-postal-code': selectedPostalCode,
    };

    const Tag = TAG_NAME as unknown as 'div';
    return (
        <div className={className} style={{ height: 600, ...style }}>
            {ready && <Tag ref={ref as Ref<HTMLDivElement>} {...(attributes as object)} />}
        </div>
    );
}

declare module 'react' {
    namespace JSX {
        interface IntrinsicElements {
            'pickup-select': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> &
                PickupSelectAttributes;
        }
    }
}
