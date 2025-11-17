// src/generators/index.ts
import type { GeneratorConfig } from '../types/generator.js';
import { PromptBuilder } from '../utils/prompt-builders.js';
export * from './ComponentGenerator.js'
export * from './PageGenerator.js'
export const StoreGenerator: GeneratorConfig = {
  description: 'Generate Vue store module',
  prompts: [
    PromptBuilder.input('name', 'Store module name:', {
      validate: (value: string) => value ? true : 'Store name is required'
    }),
    PromptBuilder.confirm('hasActions', 'Include actions?', { default: true }),
    PromptBuilder.confirm('hasGetters', 'Include getters?', { default: true })
  ],
  actions: [
    {
      type: 'add',
      path: 'src/stores/{{kebabCase name}}.ts',
      template: `
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const use{{pascalCase name}}Store = defineStore('{{camelCase name}}', () => {
  // State
  const data = ref<string[]>([])

  {{#if hasGetters}}
  // Getters
  const getDataCount = computed(() => data.value.length)
  {{/if}}

  {{#if hasActions}}
  // Actions
  const addData = (item: string) => {
    data.value.push(item)
  }

  const removeData = (index: number) => {
    data.value.splice(index, 1)
  }
  {{/if}}

  return {
    data,
    {{#if hasGetters}}
    getDataCount,
    {{/if}}
    {{#if hasActions}}
    addData,
    removeData
    {{/if}}
  }
})
      `.trim()
    }
  ]
};