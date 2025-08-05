# 第三方插件封装vue组合式函数

<div class="tip custom-block">

视频讲解

* [抖音](https://www.douyin.com/video/7535071603844009226)
* [哔哩哔哩](https://www.bilibili.com/video/BV168tJzrE66)

</div>

#### 案例插件

```shell
npm i sortablejs
npm i @types/sortablejs -D
```

### 核心代码

```typescript
import Sortable from 'sortablejs'
import { onMounted, onUnmounted, shallowRef } from 'vue'

export function useSortable(container, list, options) {
    const instance = shallowRef()
    onMounted(() => {
        instance.value = Sortable.create(container.value, {
            ...options,
            onStart() {
                console.log('前戏我要做足')
            },
            onUpdate(event) {
                options?.onUpdate?.(event)
                // newIndex = 1, oldIndex = 0
                console.log(event)
                const { newIndex, oldIndex } = event
                const oldValue = list.value[oldIndex]
                list.value.splice(oldIndex, 1)
                list.value.splice(newIndex, 0, oldValue)
            }
        })

        onUnmounted(() => {
            instance.value.destroy()
        })
    })

    return instance
}
```

### 使用 Demo

```vue
<script lang="ts" setup>
import { ref, useTemplateRef } from 'vue'
import { useSortable } from '@/components/useSortable.ts'

const container = useTemplateRef('containerRef')

const list = ref([
    {
        name: '张三',
        id: 1
    },
    {
        name: '李四',
        id: 2
    },
    {
        name: '王五',
        id: 3
    },
    {
        name: '赵六',
        id: 4
    }
])

// onMounted(() => {
//     const instance = Sortable.create(container.value, {
//         onUpdate(event) {
//             // newIndex = 1, oldIndex = 0
//             console.log(event)
//             const {newIndex, oldIndex} = event
//             const oldValue = list.value[oldIndex]
//             list.value.splice(oldIndex, 1)
//             list.value.splice(newIndex, 0, oldValue)
//         }
//     })
//
//     onUnmounted(() => {
//         instance.destroy()
//     })
// })
const instance = useSortable(container, list, {
    onUpdate(event) {
        console.log('我在 App.vue 里面监听的', event)
    }
})

setTimeout(() => {
    instance.value.destroy()
}, 3000)
</script>

<template>
    <ul ref="containerRef">
        <li v-for="item in list" :key="item.id">
            {{ item.name }}
        </li>
    </ul>
    {{ list }}
</template>
```
