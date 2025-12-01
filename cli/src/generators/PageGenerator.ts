// src/generators/PageGenerator.ts
import type { GeneratorConfig } from '../types/generator.js';
import { tableTemplate, tableHook } from '../templates/index.js';
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
            name: 'pageType',
            message: '页面:',
            choices: [
                { name: '列表页', value: 'listPage' },
            ]
        },
        /* {
            type: 'list',
            name: 'listType',
            message: '列表展示页:',
            choices: (answers: any) => {
                const baseOptions = [
                    { name: '列表页', value: 'table' },
                ];
                return baseOptions;
            },
            when: (answers: any) => {
                return answers.pageType && answers.pageType.includes('listPage');
            }
        }, */
        // 更详细的配置选项
        {
            type: 'checkbox',
            name: 'tableOptions',
            message: 'table配置:',
            choices: () => {
                const baseOptions = [
                    { name: '操作列', value: 'operaList' },
                ];
                return baseOptions;
            },
            // when: (answers: any) => {
            //     return answers.listType && answers.listType.includes('table');
            // }
            validate: (value: string) => value ? true : 'tableOptions is required',
            when: (answers: any) => {
                return answers.pageType && answers.pageType.includes('listPage');
            }
        },
        {
            type: 'checkbox',
            name: 'operaOptions',
            message: '操作项:',
            choices: () => {
                const baseOptions = [
                    { name: '编辑', value: 'edit' },
                    { name: '详情', value: 'detail' },
                    { name: '删除', value: 'delete' },
                ];
                return baseOptions;
            },
            validate: (value: string) => value ? true : 'operaOptions is required',
            when: (answers: any) => {
                return answers.tableOptions && answers.tableOptions.includes('operaList');
            }
        }
    ],
    actions: [
        {
            type: 'add',
            path: 'src/views/{{pascalCase name}}.vue',
            template: ''
        },
    ]

};
