// src/generators/ComponentGenerator.ts
import type { GeneratorConfig } from '../types/generator.js';
import { componentTemplate, styleTemplate, testTemplate } from '../templates/components/index.js';

export const ComponentGenerator: GeneratorConfig = {
    description: 'Generate Vue component',
    prompts: [
        {
            type: 'input',
            name: 'name',
            message: 'Component name:',
            validate: (value: string) => value ? true : 'Component name is required'
        },
        {
            type: 'list',
            name: 'type',
            message: 'Component type:',
            choices: [
                { name: 'Base Component', value: 'base' },
                { name: 'Business Component', value: 'business' },
                { name: 'Layout Component', value: 'layout' }
            ]
        },
        {
            type: 'confirm',
            name: 'hasStyle',
            message: 'Include style file?',
            default: true
        },
        {
            type: 'confirm',
            name: 'hasTest',
            message: 'Include test file?',
            default: false
        },
        {
            type: 'input',
            name: 'description',
            message: 'Component description:',
            default: (answers: any) => `A ${answers.type} component`
        }
    ],
    actions: function (answers) {
        const actions = [
            {
                type: 'add' as const,
                path: `src/components/{{kebabCase name}}/{{pascalCase name}}.vue`,
                template: componentTemplate(answers)
            }
        ];

        if (answers.hasStyle) {
            actions.push({
                type: 'add' as const,
                path: `src/components/{{kebabCase name}}/index.scss`,
                template: styleTemplate(answers)
            });
        }

        if (answers.hasTest) {
            actions.push({
                type: 'add' as const,
                path: `tests/components/{{kebabCase name}}.spec.js`,
                template: testTemplate(answers)
            });
        }

        return actions;
    },
    aiEnhancement: {
        enabled: true,
        model: 'gpt-3.5-turbo'
    }
};