<template>
  <div class="i-view">
    <div class="m-view">
      <div class="m-header">
        <span>{{ title }}</span>
      </div>
      <div class="m-body">
        <div class="m-addr">
        </div>
        <div class="m-data">
        </div>
      </div>
      <el-table
        size="medium"
        empty-text=""
        :data="tableData">
        <el-table-column
          header-align="center"
          prop="addr"
          label="地址">
        </el-table-column>
        <el-table-column
          header-align="center"
          prop="value"
          label="数据">
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
.m-view {
    width: 360px;
    padding: 16px;
    max-height: 100%;
}

.m-header {
    font-size: 1.6rem;
    width: 100%;
    text-align: center;
    padding: 16px;
}

.m-body {
    display: flex;
    flex-direction: column;
}

</style>
