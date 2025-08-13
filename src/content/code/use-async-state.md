# useAsyncState
<div class="tip custom-block">
场景使用：在业务中，有多个表格组件，每个组件都会访问一个异步接口，在接口请求的过程中展示loading状态，在请求完成或失败时，loading状态消失。
</div>

<code>useAsyncState.ts</code>

```typescript
import { ref as deepRef, shallowRef } from 'vue'

interface useAsyncStateOptions {
  args?: any[]
  immediate?: boolean
  shallow?: boolean
}

/**
 * 更深层次的编写方法，可以参考一下 vueuse的useAsyncState
 * @see https://vueuse.org/core/useAsyncState/
 */
export function useAsyncState(asyncFn: (...args: any) => Promise<any>, initialValue: any, options: useAsyncStateOptions = {}) {
  const { args = [], immediate = true, shallow = false } = options
  const state = shallow ? shallowRef(initialValue) : deepRef(initialValue)
  const loading = deepRef(false)
  const error = shallowRef()

  function run(...params: any[]) {
    const promise = asyncFn(...params)
    loading.value = true
    promise.then((res: any) => {
      state.value = res
    }).catch((err: any) => {
      error.value = err
    }).finally(() => {
      loading.value = false
    })
  }

  immediate && run(...args)

  return {
    state,
    loading,
    error,
    run,
  }
}
```
<code>index.vue</code>
```vue
<script setup lang="ts">
import { ElTable } from 'element-plus'
import { useAsyncState } from './useAsyncState.ts'

async function mockFetch() {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return [1, 2, 3, 4, 5]
}
const { state, loading } = useAsyncState(mockFetch, false)
</script>

<template>
    <ElTable :loading="loading" :state="state" />
</template>
```
