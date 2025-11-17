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
                { name: 'Search', value: 'search' },
                { name: 'Table', value: 'table' },
                { name: 'Form', value: 'form' },
                { name: 'Pagination', value: 'pagination' }
            ]
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