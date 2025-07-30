import path from 'node:path'
import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: '远方os Code Collection',
    description: '🪂 code collection of 远方os(Alfred-Skyblue)',
    themeConfig: {
        logo: '/logo.jpeg',
        nav: [
            { text: '首页', link: '/' },
            { text: '视频集合', link: '/video/vue-global-status' },
            { text: '代码集', link: '/code/dynamic-form' },
        ],
        sidebar: {
            '/video/': {
                items: [
                    { text: 'vue异步组件实现原理', link: '/video/vue-async-component' },
                    { text: 'vue 实现全局状态管理', link: '/video/vue-global-status' },
                    { text: 'vue 组件内的模板复用', link: '/video/use-template-reuse' },
                    { text: 'vue 组件的二次封装 - 终极版', link: '/video/component-encapsulation-ultimate' },
                ],
            },
            '/code/': {
                items: [
                    { text: '远程组件加载', link: '/code/define-async-component' },
                    { text: '动态表单', link: '/code/dynamic-form' },
                ],
            },
        },

        socialLinks: [
            { icon: 'github', link: 'https://github.com/lonewolfyx/awesome-alfred-skyblue' },
        ],
        editLink: {
            pattern: 'https://github.com/lonewolfyx/awesome-alfred-skyblue/edit/master/src/:path',
        },
        aside: false,
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
