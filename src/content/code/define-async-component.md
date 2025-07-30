# 远程组件加载

<div class="tip custom-block">

场景使用：第三方组件、低代码

</div>


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