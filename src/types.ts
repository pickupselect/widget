/** A pickup point as sent in the `onSelectPickupPoint` event (a plain object, safe to JSON.stringify). */
export interface PickupPoint {
    /** PickupSelect point ID; pass it back as `selectedPointId` later. */
    id: number;
    /** The carrier's own point ID, the one carrier APIs and label printing expect. */
    external_id: string;
    name: string;
    street: string;
    city: string;
    postal_code: string;
    /** Two-letter ISO country code, e.g. `HU`. */
    country_code: string;
    /** The carrier's point type, e.g. locker or shop. */
    group_code: string | null;
    lat: number;
    lng: number;
    /** Kilometres from the searched location, when a location was searched. */
    distance?: number;
    /** Time ranges per weekday, Monday first; a list or an object keyed 1–7 depending on the carrier. */
    opening_hours: unknown;
    icon_url: string;
    marker_icon_url?: string;
}

export interface SelectPickupPointDetail {
    /** `null` when the shopper clears the selection. */
    selectedPickupPoint: PickupPoint | null;
}

export type SelectPickupPointEvent = CustomEvent<SelectPickupPointDetail>;

/** Attributes of the `<pickup-select>` element. */
export interface PickupSelectAttributes {
    id: string;
    'widget-key': string;
    'api-key': string;
    'selected-point-id'?: number | string;
    'selected-country-code'?: string;
    'selected-postal-code'?: string;
}

/** Props shared by the React and Vue components. */
export interface PickupSelectProps {
    widgetKey: string;
    apiKey: string;
    /** Element id; generated when omitted. */
    id?: string;
    /** Opens the map at this point; takes precedence over country and postal code. */
    selectedPointId?: number;
    /** Two-letter ISO country code the widget opens with. */
    selectedCountryCode?: string;
    /** Postal code to centre on; only used together with `selectedCountryCode`. */
    selectedPostalCode?: string;
    /** Where the widget is served from. Default: https://pickupselect.com */
    origin?: string;
    /**
     * Sets filters and theme before the widget starts. The widget reads them once, when it mounts;
     * to apply new settings, remount the component (e.g. change its `key`).
     */
    configure?: (settings: WidgetOverrides) => void;
}

/** Runtime filters and appearance settings, see https://pickupselect.com/docs/advanced */
export interface WidgetOverrides {
    allowCountry(countryName: string): void;
    allowCarrier(countryName: string, carrierName: string): void;
    allowGroups(countryName: string, carrierName: string, groups: string[]): void;
    setConfig(key: 'theme', value: 'light' | 'dark'): void;
    setConfig(key: 'primary_color' | 'secondary_color', value: string): void;
    setConfig(key: string, value: unknown): void;
}

declare global {
    interface Window {
        PickupSelectOverrides?: {
            _instances: Record<string, WidgetOverrides>;
            init(widgetKey: string): WidgetOverrides;
        };
    }

    interface HTMLElementEventMap {
        onSelectPickupPoint: SelectPickupPointEvent;
    }
}
