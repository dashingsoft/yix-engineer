<template>
  <div class="i-view">
    <div class="m-view">
      <span>{{ title }}</span>
      <el-table
        :data="tableData"
        width="600">
        <el-table-column
          prop="addr"
          label="地址"
          width="180">
        </el-table-column>
        <el-table-column
          prop="value"
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
            tableData: [],
        }
    },
    mounted () {
        this.tableData.push( {
            addr: '0x000001',
            value: '18Af0882'
        } )
        this.tableData.push( {
            addr: '0x000001',
            value: '18Af0882'
        } )
        this.tableData.push( {
            addr: '0x000001',
            value: '18Af0882'
        } )
        this.tableData.push( {
            addr: '0x000001',
            value: '18Af0882'
        } )
        this.tableData.push( {
            addr: '0x000001',
            value: '18Af0882'
        } )
        this.tableData.push( {
            addr: '0x000001',
            value: '18Af0882'
        } )
        this.tableData.push( {
            addr: '0x000001',
            value: '18Af0882'
        } )
        this.tableData.push( {
            addr: '0x000001',
            value: '18Af0882'
        } )
        this.tableData.push( {
            addr: '0x000001',
            value: '18Af0882'
        } )
        this.tableData.push( {
            addr: '0x000001',
            value: '18Af0882'
        } )
        this.tableData.push( {
            addr: '0x000001',
            value: '18Af0882'
        } )
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.m-view > span {
    display: inline-block;
    width: 100%;
    text-align: center;
    padding: 6px;
}
</style>
