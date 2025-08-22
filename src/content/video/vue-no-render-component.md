# vue 中的无渲染组件

<div class="tip custom-block">

视频讲解

* [抖音](https://www.douyin.com/video/7541014543107902730)
* [哔哩哔哩](https://www.bilibili.com/video/BV1geY9zvEst)

</div>

### 核心代码

```vue
<template>
<!--    <div ref="container">-->
        <slot :data="data"></slot>
<!--    </div>-->
</template>

<script lang="ts" setup>
    /**
     * 无渲染组件：不提供 DOM 元素
     */
    import {useAttrs, useTemplateRef} from "vue";
    import {useSortable} from "@/components/useSortable.ts";

    defineOptions({
        name: 'VueSortable'
    })

    const container = useTemplateRef('container')
    const modelValue = defineModel()
    const data = useSortable(container, modelValue, useAttrs())
    defineExpose({data})
</script>
```

### 使用 Demo

```vue
<script lang="ts" setup>
import {ref} from "vue";
import VueSortable from "@/components/VueSortable.vue";

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
// const instance = useSortable(container, list, {
//     onUpdate(event) {
//         console.log('我在 App.vue 里面监听的', event)
//     }
// })

// setTimeout(() => {
//     instance.value.destroy()
// }, 3000)
</script>

<template>
    <VueSortable v-model="list">
        <li v-for="item in list" :key="item.id">{{ item.name }}</li>
    </VueSortable>
    {{ list }}
</template>
```
