# 请求竞态处理

<div class="tip custom-block">
在前端开发中，当用户快速连续触发异步请求时（如Tab页快速切换、输入框快速输入等），可能会出现请求竞态问题。即后发起的请求可能比先发起的请求更早返回，导致界面显示的数据不是最新请求的结果。

视频讲解：[抖音](https://www.douyin.com/user/MS4wLjABAAAAGUvGqSgUb8n2mLUU9SOa5wmdZy-Sj5_FUt-DK5Iu6PpxO1QgrJ1_vXy6ikzz_Q4h?from_tab_name=main&modal_id=7480970814741843227)
</div>

<code>createCancelTask.ts</code>

## 代码实现

```ts
function NOOP(): void {}

// 请求竞态处理函数
export function createCancelTask<T extends any[], R>(
  asyncTask: (...args: T) => Promise<R>
): (...args: T) => Promise<R> {
  let cancel: () => void = NOOP;
  return (...args: T): Promise<R> => {
    return new Promise<R>((resolve, reject) => {
      // 取消上一个未完成的请求
      cancel();
      // 设置新的取消函数
      cancel = (): void => {
        resolve = reject = NOOP as any;
      };
      // 写法1: 推荐写法
      asyncTask(...args).then(
        (res: R) => resolve(res),
        (err: any) => reject(err)
      );
      // 写法2: 等价写法
      // asyncTask(...args)
      //     .then((res: R) => {
      //         resolve(res)
      //     })
      //     .catch((err: any) => {
      //         reject(err)
      //     })
      // 错误写法: 不能直接传递 resolve, reject
      // asyncTask(...args).then(resolve, reject) 不能用这个
    });
  };
}
```

## 工作原理

1. **取消机制**: 每次新请求发起时，先调用 `cancel()` 函数取消上一个未完成的请求
2. **Promise 劫持**: 通过将 `resolve` 和 `reject` 设置为空函数来"取消"Promise 的回调
3. **类型安全**: 使用 TypeScript 泛型确保参数和返回值类型的正确性

## 使用场景

### 1. 搜索框自动补全

```vue
<script setup lang="ts">
import { ref } from 'vue'

const searchKeyword = ref('')
const searchResults = ref([])

const searchAPI = (keyword: string) => fetch(`/api/search?q=${keyword}`)
const cancelableSearch = createCancelTask(searchAPI)

const handleSearch = () => {
  cancelableSearch(searchKeyword.value)
    .then(data => searchResults.value = data)
}
</script>

<template>
  <input v-model="searchKeyword" @input="handleSearch" placeholder="搜索..." />
</template>
```

### 2. 列表 Tab 页切换

```vue
<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref('tab1')
const tabData = ref({})

const loadTabData = (tabId: string) => fetch(`/api/tabs/${tabId}/data`)
const cancelableLoadTab = createCancelTask(loadTabData)

const switchTab = (tabId: string) => {
  activeTab.value = tabId
  cancelableLoadTab(tabId)
    .then(data => tabData.value = data)
}
</script>

<template>
  <div class="tabs">
    <button @click="switchTab('tab1')" :class="{ active: activeTab === 'tab1' }">Tab 1</button>
    <button @click="switchTab('tab2')" :class="{ active: activeTab === 'tab2' }">Tab 2</button>
  </div>
</template>
```

## 注意事项

1. **网络请求不会真正取消**: 这种方法只是忽略了旧请求的回调，实际的网络请求仍会继续
2. **适用于 UI 更新场景**: 主要解决 UI 状态不一致的问题
3. **错误处理**: 被取消的请求不会触发 reject，需要注意错误处理逻辑
