# 动态表单

<code>config.ts</code>

```typescript
import {
    Cascader,
    Checkbox,
    CheckboxGroup,
    DatePicker,
    Input,
    InputNumber,
    Radio,
    RadioGroup,
    Slider,
    Switch,
    Textarea,
    TimePicker,
    TreeSelect,
    Select,
} from 'ant-design-vue'
import { type Component, h } from 'vue'
import { isString } from 'lodash-es'
import { transformModelValue } from '@cyb/shared'

const formItemMap = new Map<string, Component>([
    ['input', transformModelValue(Input)],
    ['textarea', transformModelValue(Textarea)],
    ['number', transformModelValue(InputNumber)],
    ['time', transformModelValue(TimePicker)],
    [
        'date',
        transformModelValue((props, { slots, attrs }) =>
            h(DatePicker, { valueFormat: 'YYYY-MM-DD', ...attrs, ...props }, slots),
        ),
    ],
    ['cascader', Cascader],
    ['slider', Slider],
    ['checkbox', transformModelValue(Checkbox, 'checked')],
    ['checkboxGroup', CheckboxGroup],
    ['radio', Radio],
    ['radioGroup', transformModelValue(RadioGroup)],
    ['switch', Switch],
    ['treeSelect', TreeSelect],
    ['select', transformModelValue(Select)],
])

export const getFormItemComponent = (type?: string | Component): Component => {
    if (type && !isString(type)) return type
    // @ts-expect-error
    return (type && formItemMap.get(type)) || formItemMap.get('input')
}
```

<code>index.ts</code>

```typescript
export { default as VFormBuilder } from './index.vue'
export * from './types'
```

<code>index.vue</code>

```vue
<template>
  <a-form ref="formRef" :model="formData" :rules="rules" v-bind="formConfig">
    <a-row>
      <a-col v-for="item of formItemsComputed" :key="item.field" :span="item.span || span">
        <a-form-item :name="item.field" v-bind="getFormItemProps(item)">
          <template v-slot:label>
            <span v-if="typeof item.label === 'function'">
              <component :is="item.label as Function"></component>
            </span>
            <span v-else>{{ item.label }}</span>
          </template>
          <slot :name="item.field">
            <component :is="ComponentItem" :item="item"> </component>
          </slot>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script lang="ts" setup>
import { getFormItemComponent } from './config'
import type { IFormItem } from './types'
import { h } from 'vue'
import type { FormInstance } from 'ant-design-vue'

defineOptions({
  name: 'VFormBuilder',
})

const baseFieldReg = /^(type|label|props|on|span|key|hidden|required|rules|col|formProps)$/

interface Props {
  formItems: IFormItem[]
  formConfig?: Record<string, any>
  span?: number // 列跨度
  rules?: Record<string, any>
}

// 定义表单数据模型
const formData = defineModel<Record<string, any>>({
  default: () => ({}), // 默认值为空对象
})

// 定义组件属性并设置默认值
const props = withDefaults(defineProps<Props>(), {
  formItems: () => [], // 默认表单项为空数组
  formConfig: () => ({}), // 默认表单配置为空对象
  span: 24, // 默认列跨度为24
})

// 表单实例引用
const formRef = ref<FormInstance>()

// 默认标签宽度
const defaultLabelWidth = '80px'

// 计算表单项，过滤掉隐藏的项
const formItemsComputed = computed(() => {
  return props.formItems.filter((item) => item.hidden !== true)
})

/**
 * 获取表单项属性
 */
function getFormItemProps(formItem: IFormItem) {
  const { formProps = {} } = formItem
  const { labelCol = {}, ...rest } = formProps
  const formLabelWidth = props?.formConfig?.labelCol?.style?.width
  const labelWidth = labelCol?.style?.width === '0px' ? formLabelWidth : labelCol?.style?.width
  return {
    labelCol: {
      style: {
        width: labelWidth || defaultLabelWidth,
      },
    },
    ...rest, // 其他属性
  }
}

const selectType = new Set(['select', 'date', 'time', 'treeSelect'])

const ComponentItem = {
  props: ['item'],
  setup({ item }) {
    const props = Object.keys(item).reduce<Record<string, any>>(
      (prev, key) => {
        if (!baseFieldReg.test(key)) {
          prev[key] = item[key]
        }
        return prev
      },
      { ...item.props, formData: formData.value },
    )

    if (!('placeholder' in props)) {
      const { type } = item
      const text = selectType.has(type) ? '请选择' : '请输入'
      props.placeholder = text + item.label
    }
    const tag = getFormItemComponent(item.type)
    return () =>
      h(
        tag,
        {
          ...props,
          modelValue: formData.value[item.field],
          'onUpdate:modelValue': (val: string) => {
            formData.value[item.field] = val
          }, // 更新 modelValue
        },
        item.slots, // 插槽内容
      )
  },
}

/**
 * 验证表单
 */
function validate() {
  return formRef.value?.validate()
}

defineExpose({
  validate,
})
</script>
```

<code>types.ts</code>

```typescript
import type { VNode, Component } from 'vue'
/**
 * 表单项
 */
export interface IFormItem<T extends object = Record<string, any>> {
  // 表单项 label
  label?: string | (() => VNode)
  // 表单项绑定字段
  field: string
  // 占位符
  placeholder?: any
  // 禁用标识
  disabled?: boolean
  // 表单项属性，组件会将所有的 props 传递给 type 绑定的组件
  props?: T
  // 组件类型，根据所传递的类型，动态渲染表单项，默认显示为 input 输入框
  type?: string | Component
  // 表单项栅格数
  span?: number
  // 表单项唯一标识，未传递时会使用 field 作为唯一标识，若表单项中存在相同的 field 则必须传递 key
  key?: string
  // 隐藏标识
  hidden?: boolean
  // 是否必填
  required?: boolean
  // 栅格配置
  [key: string]: any
}
```

### 使用示例

```vue
<script setup lang="ts">
import locale from 'ant-design-vue/es/locale/zh_CN'
import { VFormBuilder } from '@cyb/core'

// dayjs 设置 dayjs 为中文语言
const formInstance = useTemplateRef('form')
const formData = ref({})
const formItems = [
  {
    type: 'input',
    label: '姓名',
    field: 'name',
    placeholder: '请输入姓名',
  },
  {
    type: 'date',
    label: '出生日期',
    field: 'birthDate',
    placeholder: '请选择出生日期',
    format: 'YYYY-MM-DD',
  },
]

const rules = {
  name: [{ required: true, message: '请输入姓名' }],
  birthDate: [{ required: true, message: '请选择出生日期' }],
}
async function submit() {
  await formInstance.value.validate()
  console.log('formData.value ==> ', formData.value)
}
</script>

<template>
  <a-config-provider :locale="locale">
    <VFormBuilder
      :rules="rules"
      :form-items="formItems"
      v-model="formData"
      ref="form"
    ></VFormBuilder>
    <a-button @click="submit">提交</a-button>
  </a-config-provider>
</template>
```