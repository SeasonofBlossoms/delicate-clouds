export function framework (args: any): string {
    const { templateContent, scscriptContent, styleContent } = args || {};
    return `<template>
    {{templateContent}}
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue';
{{scriptContent}}
</script>
<style scoped lang="scss">
    {{styleContent}}
</style>`.trim()
}

