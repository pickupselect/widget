import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts', 'src/react.tsx', 'src/vue.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
    // the widget itself is never bundled: it is loaded from pickupselect.com at runtime
    external: ['react', 'vue'],
    banner: { js: "'use client';" },
});
