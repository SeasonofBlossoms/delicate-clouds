module.exports = {
  name: "列表页面",
  description: "标准列表页面，包含搜索表单和表格",
  components: ["SearchForm", "DataTable", "Pagination"],
  layout: {
    type: "vertical",
    sections: ["search", "toolbar", "table", "pagination"],
  },
  interactions: ["search", "reset", "add", "edit", "delete", "batch"],
  variables: [
    {
      name: "pageName",
      description: "页面名称",
      type: "string",
      required: true,
    },
    {
      name: "apiPath",
      description: "列表数据接口路径",
      type: "string",
      required: true,
    },
  ],
  files: [
    {
      path: "src/views/{pageName}/index.vue",
      template: "list-page/index.vue",
    },
    {
      path: "src/views/{pageName}/components/SearchForm.vue",
      template: "list-page/SearchForm.vue",
    },
    {
      path: "src/api/{pageName}.js",
      template: "list-page/api.js",
    },
  ],
};
