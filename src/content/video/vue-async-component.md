# vue异步组件实现原理

<div class="tip custom-block">

视频讲解

* [抖音](https://www.douyin.com/video/7532885587477450003)
* [哔哩哔哩](https://www.bilibili.com/video/BV12N8qzzE9R)

</div>

### 核心代码 `src/libs/apiAsyncComponent.ts`

```typescript
import {h, shallowRef} from "vue";

export const defineAsyncComponent = (options) => {

    if (typeof options === 'function') {
        options = {
            loader: options
        }
    }

    const defaultComponent = () => h('div')
    const {
        loader,
        loadingComponent = defaultComponent,
        errorComponent = defaultComponent,
        timeout
    } = options

    return {
        setup(_, {attrs, slots}) {

            /**
             * 异步组件：
             * 在不同的状态下，显示不同的组件
             */
            const component = shallowRef(loadingComponent)

            const loadComponent = () => {
                return new Promise((resolve, reject) => {
                    if (timeout) {
                        setTimeout(() => {
                            reject('超时了')
                        }, timeout)
                    }
                    loader().then(resolve, reject)
                })
            }

            loadComponent()
                .then(com => {
                    if (com && com[Symbol.toStringTag] === 'Module') {
                        com = com.default
                    }
                    // 加载成功
                    component.value = com
                })
                .catch(err => {
                    console.log('err', err)
                    // 加载失败,或者超时
                    component.value = errorComponent
                })

            return () => {
                return h(component.value, attrs, slots)
            }
        }
    }
}
```

### 使用 Demo

```vue
<script lang="ts" setup>
    import {defineAsyncComponent} from "@/libs/apiAsyncComponent.ts";
    import {h} from "vue";

    const AsyncComponent = defineAsyncComponent({
        // loader: () => {
        //     return new Promise((resolve, reject) => {
        //         setTimeout(() => {
        //             const com = {
        //                 setup() {
        //                     return () => h('div', '异步组件')
        //                 }
        //             }
        //
        //             resolve(com)
        //         }, 4000)
        //     })
        // },
        loader: () => import('./components/HelloWorld.vue'),
        timeout: 3000,
        loadingComponent: {
            render: () => h('div', 'loading...')
        },
        errorComponent: {
            render: () => h('div', '加载失败...')
        }
    })
</script>

<template>
    <AsyncComponent msg="app 传的 msg">
        <div>插槽</div>
    </AsyncComponent>
</template>

```
