import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    // the package is linked from ../.. and has its own React in node_modules: use only this app's copy
    resolve: { dedupe: ['react', 'react-dom'] },
    server: { port: 5173 },
});
