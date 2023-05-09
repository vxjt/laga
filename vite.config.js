import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        proxy: {
            // with options: http://localhost:5173/api/bar-> http://jsonplaceholder.typicode.com/bar
            '/rcna1': {
                target: 'https://na1.api.riotgames.com',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/rcna1/, ''),
            },
            '/rcam': {
                target: 'https://americas.api.riotgames.com/',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/rcam/, ''),
            },
        },
    },
    // some other configuration
});