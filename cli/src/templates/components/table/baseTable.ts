function getOperaOptions (answers: any) {
  return answers?.searchTableOptions?.includes('operaOptions');
}
export function tableTemplate (answers: any): string {
  const operaOptions = getOperaOptions(answers)
  return `<el-table :data="tableData" style="width: 100%">
    <el-table-column prop="date" label="Date" width="180" />
    <el-table-column prop="name" label="Name" width="180" />
    <el-table-column prop="address" label="Address" />
    {{#if operaOptions}}
    <el-table-column label="Operations" width="180">
      <template #default="scope">
       {{each operaOptions as option }}
        <el-button @click="opera('{{option}}', scope.row)" type="text">{{option}}</el-button>
       {{/each}}
      </template>
    </el-table-column>
    {{/if}}
  </el-table>`.trim();
}
export function tableHook (answers: any): string {
  const operaOptions = getOperaOptions(answers)

  return `const tableData = ref([
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
])
{{#if operaOptions}}
function opera(type: string, row: any) {
  console.log(type, row);
}
{{/if}}
`.trim();
}
const baseTable = {
  tableTemplate, tableHook
}
export default baseTable