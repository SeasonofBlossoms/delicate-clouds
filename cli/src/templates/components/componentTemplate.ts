// src/templates/components/componentTemplate.ts
export function componentTemplate (answers: any): string {
  const { name, description, type } = answers;

  return `
<template>
  <div class="{{kebabCase name}}">
    <h3>{{titleCase name}} Component</h3>
    <slot />
  </div>
</template>

<script setup lang="ts">
// {{description}}
import { ref, computed } from 'vue'

// Props
interface Props {
  // Add your props here
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  // Add your emits here
}>()

// Reactive data
const localData = ref<string>('')

// Computed properties
const computedValue = computed(() => {
  return localData.value.toUpperCase()
})

// Methods
const handleClick = () => {
  console.log('Component clicked')
}

// Lifecycle
onMounted(() => {
  console.log('{{pascalCase name}} component mounted')
})
</script>

{{#if hasStyle}}
<style scoped lang="scss">
.{{kebabCase name}} {
  display: block;
  
  h3 {
    color: #333;
    margin-bottom: 1rem;
  }
}
</style>
{{/if}}
`.trim();
}

export function styleTemplate (answers: any): string {
  const { name } = answers;

  return `
// {{pascalCase name}} component styles
.{{kebabCase name}} {
  // Component styles here
}
`.trim();
}

export function testTemplate (answers: any): string {
  const { name } = answers;

  return `
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import {{pascalCase name}} from '@/components/{{pascalCase name}}.vue'

describe('{{pascalCase name}}', () => {
  it('renders properly', () => {
    const wrapper = mount({{pascalCase name}})
    expect(wrapper.text()).toContain('{{titleCase name}} Component')
  })
})
`.trim();
}