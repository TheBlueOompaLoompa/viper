/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get({ params }) {
    return {
        body: {
            short_name: 'Viper',
            name: 'Viper Social',
            icons: [
                {
                    src: '/logo.svg',
                    type: 'imagn/svg+xml',
                    sizes: '512x512',
                    purpose: 'maskable'
                },
                {
                    "src": "static/icons/manifest-icon-192.png",
                    "sizes": "192x192",
                    "type": "image/png",
                    "purpose": "maskable any"
                },
                {
                    "src": "static/icons/manifest-icon-512.png",
                    "sizes": "512x512",
                    "type": "image/png",
                    "purpose": "maskable any"
                }
            ],
            start_url: '/',
            background_color: '#191919',
            display: 'standalone',
            scope: '/',
            theme_color: '#A1FA57',
            description: 'Viper is a privacy focused social media app.'
        }
    };
}