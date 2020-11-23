<template>
  <div class="d-view">
    <el-table
      size="mini"
      :strip="true"
      :data="tableData">
      <el-table-column
        prop="name"
        label="名称"
        width="auto">
      </el-table-column>
      <el-table-column
        prop="type"
        label="类型"
        width="auto">
      </el-table-column>
      <el-table-column
        prop="value">
        <template slot-scope="scope" v-if="editable">
          <el-input
            size="mini"
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
        tableData: Array,
        editable: {
            type: Boolean,
            default: true
        }
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
        this.tableData2 = this.tableData
    },
    methods: {
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
