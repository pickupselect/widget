import { useState } from 'react';
import { PickupSelect, type PickupPoint } from '@pickupselect/widget/react';

const widgetKey = import.meta.env.VITE_PICKUPSELECT_WIDGET_KEY;
const apiKey = import.meta.env.VITE_PICKUPSELECT_API_KEY;

export function App() {
    const [point, setPoint] = useState<PickupPoint | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [country, setCountry] = useState('HU');
    const [postalCode, setPostalCode] = useState('1051');
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    if (!widgetKey || !apiKey) {
        return <p>Copy .env.example to .env.local and fill in your widget key and API key.</p>;
    }

    return (
        <main style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 1100, margin: '0 auto', padding: 16 }}>
            <h1>PickupSelect React example</h1>

            <form style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 12 }} onSubmit={(e) => e.preventDefault()}>
                <label>
                    Country <input value={country} onChange={(e) => setCountry(e.target.value.toUpperCase())} size={3} />
                </label>
                <label>
                    Postal code <input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} size={8} />
                </label>
                <label>
                    Theme{' '}
                    <select value={theme} onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}>
                        <option value="light">light</option>
                        <option value="dark">dark</option>
                    </select>
                </label>
            </form>

            {/* the widget reads its start position and overrides once, on mount: a new key remounts it */}
            <PickupSelect
                key={`${country}-${postalCode}-${theme}`}
                widgetKey={widgetKey}
                apiKey={apiKey}
                selectedCountryCode={country}
                selectedPostalCode={postalCode}
                configure={(settings) => settings.setConfig('theme', theme)}
                onSelect={setPoint}
                onError={(e) => setError(e.message)}
            />

            {error && <p style={{ color: 'crimson' }}>{error}</p>}

            <h2>Selected point</h2>
            <pre style={{ background: '#f4f4f5', padding: 12, overflow: 'auto' }}>
                {point ? JSON.stringify(point, null, 2) : 'Select a pickup point on the map.'}
            </pre>
        </main>
    );
}
