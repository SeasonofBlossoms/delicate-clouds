// src/templates/pages/pageTemplate.ts
export function pageTemplate (answers: any): string {
    const { name, layout, features } = answers;
    const hasTable = features.includes('table');
    const hasForm = features.includes('form');
    const hasSearch = features.includes('search');
    const hasPagination = features.includes('pagination');

    return `
<template>
  <div class="{{kebabCase name}}-page">
    <div class="page-header">
      <h1>{{titleCase name}} Page</h1>
      {{#if hasSearch}}
      <div class="search-section">
        <el-input 
          v-model="searchQuery" 
          placeholder="Search..." 
          clearable 
          @change="handleSearch"
        />
      </div>
      {{/if}}
    </div>

    <div class="page-content">
      {{#if hasTable}}
      <div class="table-section">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="name" label="Name" />
          <el-table-column prop="createdAt" label="Created" />
          <el-table-column label="Operations" width="120">
            <template #default="scope">
              <el-button link @click="handleEdit(scope.row)">Edit</el-button>
              <el-button link type="danger" @click="handleDelete(scope.row)">Delete</el-button>
            </template>
          </el-table-column>
        </el-table>
        
        {{#if hasPagination}}
        <div class="pagination-section">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
        {{/if}}
      </div>
      {{/if}}

      {{#if hasForm}}
      <div class="form-section">
        <el-form :model="form" label-width="120px">
          <el-form-item label="Name">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSubmit">Submit</el-button>
            <el-button @click="handleReset">Reset</el-button>
          </el-form-item>
        </el-form>
      </div>
      {{/if}}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'

// Search functionality
{{#if hasSearch}}
const searchQuery = ref('')
const handleSearch = () => {
  // Implement search logic
}
{{/if}}

// Table data
{{#if hasTable}}
interface TableItem {
  id: number
  name: string
  createdAt: string
}

const tableData = ref<TableItem[]>([])
{{/if}}

// Pagination
{{#if hasPagination}}
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const handleSizeChange = (size: number) => {
  pageSize.value = size
  fetchData()
}

const handleCurrentChange = (page: number) => {
  currentPage.value = page
  fetchData()
}
{{/if}}

// Form handling
{{#if hasForm}}
const form = reactive({
  name: ''
})

const handleSubmit = () => {
  // Implement form submission
}

const handleReset = () => {
  // Implement form reset
}
{{/if}}

// Methods
const handleEdit = (item: any) => {
  console.log('Edit:', item)
}

const handleDelete = (item: any) => {
  console.log('Delete:', item)
}

const fetchData = async () => {
  // Implement data fetching
}

// Lifecycle
onMounted(() => {
  fetchData()
})
</script>

<style scoped lang="scss">
.{{kebabCase name}}-page {
  padding: 20px;

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h1 {
      margin: 0;
      color: #303133;
    }
  }

  .search-section {
    width: 300px;
  }

  .table-section {
    margin-bottom: 20px;
  }

  .pagination-section {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }

  .form-section {
    margin-top: 20px;
  }
}
</style>
`.trim();
}