<template>
  <div class="i-view">
    <div class="m-view">
      <span>{{ title }}</span>
      <el-table
        :data="tableData">
        <el-table-column
          prop="address"
          label="地址"
          width="180">
        </el-table-column>
        <el-table-column
          prop="name"
          label="数值"
          width="180">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>

export default {
    name: 'RealMemoryView2',
    data() {
        return {
            title: '内存数据视图',
            width: 800,
            height: 600,
            tableData: [{
                date: '2016-05-02',
                name: '王小虎',
                address: ''
            }, {
                date: '2016-05-04',
                name: '王小虎',
                address: ''
            }, {
                date: '2016-05-01',
                name: '王小虎',
                address: ''
            }, {
                date: '2016-05-03',
                name: '王小虎',
                address: ''
            }]
        }
    },
    mounted() {
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
