# useStorageRef

<div class="tip custom-block">
场景使用：在输入框中输入数据，页面刷新后数据将会保留
</div>
<code>useStorage.ts</code>

```typescript
import { customRef } from "vue"

interface optionsType  {
  storage: Storage
  toJSON: boolean
}

export function useStorageRef(
  key: string,
  initialValue: any = "",
  options: Partial<optionsType> = {}
) {
  const { storage = localStorage, toJSON = false } = options
  return customRef((track, trigger) => {
    return {
      get() {
        track()
        const value = storage.getItem(key) || initialValue
        return toJSON ? JSON.parse(value) : value
      },
      set(value: any) {
        const prev = storage.getItem(key)
        if (prev === value) return
        storage.setItem(key, toJSON ? JSON.stringify(value) : value)
        trigger()
      },
    }
  })
}
```

<code>index.vue</code>

```vue
<template>
  <el-input v-model="value" placeholder="请输入内容" />
</template>

<script lang="ts" setup>
import { useStorageRef } from "./useStorageRef.ts"

const value = useStorageRef("keys")
</script>
```
