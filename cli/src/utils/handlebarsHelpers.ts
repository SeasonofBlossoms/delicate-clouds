import type { HelperOptions, SafeString } from 'handlebars';

// 定义 Helper 函数的上下文类型
interface HelperContext {
    [key: string]: any;
}

export function registerHelpers (handlebars: any): void {
    // 字符串转换 helpers
    handlebars.registerHelper('pascalCase', function (this: HelperContext, str: string) {
        if (!str) return '';
        return str.replace(/(^\w|-\w)/g, (match: string) =>
            match.replace(/-/, '').toUpperCase()
        );
    });

    handlebars.registerHelper('camelCase', function (this: HelperContext, str: string) {
        if (!str) return '';
        return str.replace(/-\w/g, (match: string) =>
            match.slice(1).toUpperCase()
        );
    });

    handlebars.registerHelper('kebabCase', function (this: HelperContext, str: string) {
        if (!str) return '';
        return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    });

    handlebars.registerHelper('titleCase', function (this: HelperContext, str: string) {
        if (!str) return '';
        return str.replace(/\w\S*/g, (txt: string) =>
            txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
    });

    // 条件判断 helpers
    handlebars.registerHelper('if_eq', function (this: HelperContext, a: any, b: any, options: HelperOptions) {
        return a === b ? options.fn(this) : options.inverse(this);
    });

    handlebars.registerHelper('unless_eq', function (this: HelperContext, a: any, b: any, options: HelperOptions) {
        return a !== b ? options.fn(this) : options.inverse(this);
    });

    // 添加更多有用的 helpers
    handlebars.registerHelper('json', function (this: HelperContext, context: any) {
        return JSON.stringify(context);
    });

    handlebars.registerHelper('includes', function (this: HelperContext, array: any[], value: any, options: HelperOptions) {
        if (Array.isArray(array) && array.includes(value)) {
            return options.fn(this);
        }
        return options.inverse(this);
    });

    handlebars.registerHelper('toLowerCase', function (this: HelperContext, str: string) {
        return str ? str.toLowerCase() : '';
    });

    handlebars.registerHelper('toUpperCase', function (this: HelperContext, str: string) {
        return str ? str.toUpperCase() : '';
    });
}