// src/utils/stringUtils.ts
export function toPascalCase (str: string): string {
    return str.replace(/(^\w|-\w)/g, (match) =>
        match.replace(/-/, '').toUpperCase()
    );
}

export function toCamelCase (str: string): string {
    return str.replace(/-\w/g, (match) =>
        match.slice(1).toUpperCase()
    );
}

export function toKebabCase (str: string): string {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

export function toTitleCase (str: string): string {
    return str.replace(/\w\S*/g, (txt) =>
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
}