import path from 'node:path'
import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: '远方os Code Collection',
    description: '🪂 code collection of 远方os(Alfred-Skyblue)',
    themeConfig: {
        logo: '/logo.jpeg',
        sidebar: [
            {
                items: [
                    { text: 'vue 组件内的模板复用', link: '/use-template-reuse' },
                ],
            },
        ],

        socialLinks: [
            { icon: 'github', link: 'https://github.com/lonewolfyx/awesome-alfred-skyblue' },
        ],
        editLink: {
            pattern: 'https://github.com/lonewolfyx/awesome-alfred-skyblue/edit/master/src/:path',
        },
        outline: false,
    },
    lastUpdated: true,
    srcDir: path.resolve(__dirname, '../src'),
    rewrites: {
        'content/(.*)': '(.*)',
    },
    vite: {
        server: {
            port: 2025,
            host: '0.0.0.0',
            open: true,
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, '../src'),
            },
        },
    },
})
