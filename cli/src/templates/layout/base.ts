export function baseLayout (arg: any): string {
    const content = arg?.content || '';
    return `
<div class="base_layout">
    {{content}}
</div>
`.trim();
}
