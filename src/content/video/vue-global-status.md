# vue 实现全局状态管理

<div class="tip custom-block">

视频讲解

* [抖音](https://www.douyin.com/video/7519093763411545378)
* [哔哩哔哩](https://www.bilibili.com/video/BV1jBKbzrEZd)

</div>

### 核心代码

```typescript
import { computed, effectScope, ref } from 'vue'

export const useCounterStore = defineStore(() => {
    const count = ref(0)
    const doubleCount = computed(() => count.value * 2)

    function increment() {
        count.value++
    }

    return { count, doubleCount, increment }
})

function defineStore(fn: any) {
    let state: any
    return () => {
        if (state)
            return state

        const scope = effectScope(true)

        return (state = scope.run(fn))
    }
}
```

### 使用 Demo

pinia 如何用它就怎么用