// src/generators/PageGenerator.ts
import type { GeneratorConfig } from '../types/generator.js';

export const PageGenerator: GeneratorConfig = {
    description: 'Generate Vue page',
    prompts: [
        {
            type: 'input',
            name: 'name',
            message: 'Page name:',
            validate: (value: string) => value ? true : 'Page name is required'
        },
        {
            type: 'list',
            name: 'layout',
            message: 'Page layout:',
            choices: [
                { name: 'List', value: 'list' },
                { name: 'Default', value: 'default' },
                { name: 'Sidebar', value: 'sidebar' },
                { name: 'Fullscreen', value: 'fullscreen' }
            ]
        },
        {
            type: 'checkbox',
            name: 'features',
            message: 'Page features:',
            choices: [
                { name: 'SearchTable', value: 'SearchTable' },
                { name: 'Search', value: 'search' },
                { name: 'Form', value: 'form' },
                { name: 'Pagination', value: 'pagination' }
            ]
        },
        // 更详细的配置选项
        {
            type: 'checkbox',
            name: 'searchTableOptions',
            message: 'SearchTable options:',
            choices: (answers: any) => {
                const baseOptions = [
                    { name: 'Batch Operations', value: 'batch' },
                    { name: 'Row Selection', value: 'selection' },
                    { name: 'Export Excel', value: 'export' }
                ];

                // 根据其他选择动态调整选项
                if (answers.features && answers.features.includes('form')) {
                    baseOptions.push(
                        { name: 'Quick Edit Form', value: 'quickEdit' }
                    );
                }

                if (answers.layout === 'list') {
                    baseOptions.push(
                        { name: 'Advanced Filters', value: 'advancedFilters' }
                    );
                }

                return baseOptions;
            },
            when: (answers: any) => {
                return answers.features && answers.features.includes('SearchTable');
            }
        }
    ],
    actions: [
        {
            type: 'add',
            path: 'src/views/{{pascalCase name}}.vue',
            template: `<!-- {{pascalCase name}} Page -->`
        },
        {
            type: 'add',
            path: 'src/router/{{kebabCase name}}.ts',
            template: `// Route for {{pascalCase name}} page`
        }
    ]
};