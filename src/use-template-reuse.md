# vue 组件内的模板复用

<div class="tip custom-block">

视频讲解

* [抖音](https://www.douyin.com/video/7517630905150737727)
* [哔哩哔哩](https://www.bilibili.com/video/BV1aLN4zREKH)

</div>

### 核心代码

```typescript
import type { SetupContext, SlotsType, VNodeChild } from 'vue'

export function createReusableTemplate<T extends Record<string, any> = Record<string, any>>() {
    let render: ((props: T) => VNodeChild) | null

    const DefineTemplate = {
        setup(_: Record<string, any>, context: SetupContext<{}, SlotsType<{ default: (props: T) => VNodeChild }>>) {
            return () => {
                render = context.slots.default
            }
        }
    }

    const UseTemplate = (props: T): VNodeChild => render?.(props)

    return [DefineTemplate, UseTemplate]
}
```

### 使用 Demo

```vue
<template>
    <DefineTemplate v-slot="{ title, onFoo }">
        <div>
            <div>{{ title }}</div>
            <div @click="onFoo(123)">
                asdasd
            </div>
        </div>
    </DefineTemplate>
    <div>这是分割线</div>
    <UseTemplate title="header" @foo="console.log" />
    <div>这是分割线</div>
    <UseTemplate @foo="console.log" />
</template>

<script lang="ts" setup>
import { createReusableTemplate } from '@/hooks/createReusableTemplate.ts'

const [DefineTemplate, UseTemplate] = createReusableTemplate()
</script>
```
