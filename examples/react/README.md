# React example

A Vite + React app that uses the package from this repository (`file:../..`), for trying changes before publishing.

```sh
npm install && npm run build          # in the repository root: builds dist/
cd examples/react
cp .env.example .env.local            # then fill in your widget key and API key
npm install
npm run dev                           # http://localhost:5173
```

After changing the package, run `npm run build` in the root again; Vite picks up the new `dist/`.

What to try: select a point (the JSON below the map updates, and clearing the selection shows `null`), then change the
country, postal code or theme (the widget remounts with the new start position and settings).
