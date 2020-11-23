<template>
  <div class="d-view">
    <el-table
      size="mini"
      :highlight-current-row="true"
      :data="tableData"
      :show-header="true">
      <el-table-column
        prop="name"
        width="auto">
      </el-table-column>
      <el-table-column
        prop="type"
        width="auto">
      </el-table-column>
      <el-table-column
        prop="value">
        <template slot-scope="scope" v-if="editable">
          <el-input
            v-model="scope.row.value"
            clearable>
          </el-input>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

export default {
    name: 'DataView',
    props: {
        tableData: Object,
        editable: Boolean,
    },
    data() {
        return {
            tableData2: [],
        }
    },
    computed: {
        title: function () {
            return this.filename ? this.filename : "未命名"
        },
    },
    mounted() {
    },
    methods: {
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
