# @pickupselect/widget

[![npm](https://img.shields.io/npm/v/@pickupselect/widget)](https://www.npmjs.com/package/@pickupselect/widget)

A pickup point selector map for European carriers in your checkout: parcel lockers and shops from Foxpost, Packeta, GLS,
DPD and more, in one widget. This package contains the loader, TypeScript types and React/Vue components for
[PickupSelect](https://pickupselect.com).

The widget itself is served from pickupselect.com, so fixes and new carriers reach your shop without an `npm update`.

```sh
npm i @pickupselect/widget
```

You need a widget key and an API key from the [PickupSelect dashboard](https://pickupselect.com) (a free plan is available).

## React / Next.js

```tsx
import { PickupSelect } from '@pickupselect/widget/react';

<PickupSelect
    widgetKey="wk_..."
    apiKey="pk_..."
    selectedCountryCode="HU"
    selectedPostalCode="1051"
    onSelect={(point) => setPickupPoint(point)}
/>
```

The component is marked `'use client'`, so it works in the Next.js App Router as is.

## Vue 3

```vue
<script setup>
import { PickupSelect } from '@pickupselect/widget/vue';
</script>

<template>
    <PickupSelect widget-key="wk_..." api-key="pk_..." @select="(point) => (pickupPoint = point)" />
</template>
```

No `isCustomElement` setting is needed.

## Any other framework

```ts
import { loadPickupSelect } from '@pickupselect/widget';

await loadPickupSelect();
// then render <pickup-select id="..." widget-key="..." api-key="..."> and listen for onSelectPickupPoint
```

## Props

| Prop | | |
| --- | --- | --- |
| `widgetKey`, `apiKey` | required | From the widget editor |
| `selectedPointId` | optional | Opens the map at this point (takes precedence) |
| `selectedCountryCode` | optional | Two-letter ISO code the widget opens with |
| `selectedPostalCode` | optional | Centres the map on this postal code, together with the country |
| `id` | optional | Element id, generated when omitted |
| `origin` | optional | Default `https://pickupselect.com` |

## The selected point

`onSelect` / `@select` receives a `PickupPoint`, or `null` when the shopper clears the selection. Store at least `id`
(to pass back as `selectedPointId`) and `external_id` (the carrier's own ID, for carrier APIs and labels) with the
order. See the `PickupPoint` type for all fields.

## Filters and theme

```tsx
<PickupSelect
    widgetKey="wk_..."
    apiKey="pk_..."
    configure={(settings) => {
        settings.allowCountry('Hungary');
        settings.allowCarrier('Hungary', 'Foxpost');
        settings.allowGroups('Hungary', 'Foxpost', ['Locker']);
        settings.setConfig('theme', 'dark');
    }}
/>
```

The widget reads these settings once, when it starts. To apply different settings, remount the component, e.g. by
changing its `key`. Without a framework, call `configureWidget(widgetKey, fn)` after `loadPickupSelect()` and before
adding the `<pickup-select>` element.

Overrides only narrow what is enabled for the widget in the dashboard. Details:
[Advanced configuration](https://pickupselect.com/docs/advanced).

## Testing locally

The widget works on `localhost`. If you have set Allowed Origins for the widget, add your local address
(e.g. `http://localhost:3000`).

## License

MIT
