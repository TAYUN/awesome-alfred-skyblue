# vue 组件的二次封装 - 终极版

<div class="tip custom-block">

视频讲解

* [抖音](https://www.douyin.com/video/7516108480906792207)
* [哔哩哔哩](https://www.bilibili.com/video/BV1soMtz4ExE)

</div>

### 核心代码

```vue
<template>
    <div>
        <span>组件的二次封装</span>
        <component :is="h(ElInput, { ...$attrs, ...props, ref: changeRef }, $slots)" />
    </div>
</template>

<script setup lang="ts">
import type { InputProps } from 'element-plus'
import type { ComponentInternalInstance } from 'vue'
import { ElInput } from 'element-plus'
import { getCurrentInstance, h } from 'vue'

defineOptions({
    name: 'MyInput',
})

/**
 * 父组件传递的属性
 */
const props = defineProps<Partial<InputProps>>()

const vm = getCurrentInstance() as ComponentInternalInstance

/**
 * 暴露给父组件的方法
 * @param instance
 */
function changeRef(instance: Record<string, any> | null) {
    vm.exposed = vm.exposeProxy = instance || {}
}

/**
 * 1、props 如何透传
 * 2、插槽 如何穿透过去
 * 3、组件的方法，如何暴露出去
 */
</script>
```

### 使用 Demo

```vue
<template>
    <MyInput ref="inputRef" v-model="msg">
        <template #append>
            append
        </template>
    </MyInput>
</template>

<script lang="ts" setup>
import type { InputInstance } from 'element-plus'
import { ref } from 'vue'
import MyInput from '@/components/MyInput.vue'

const msg = ref<string>('111')
const inputRef = ref<InputInstance>()

setTimeout(() => {
    inputRef.value?.clear()
}, 1e3)
</script>

```