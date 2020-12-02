<template>
  <div class="i-view">
    <div class="m-view">
      <div class="m-header">
        <span>{{ title }}</span>
      </div>
      <div class="m-body">
        <el-table
          :data="tableData"
          :show-header="false"
          :cell-style="cellStyle"
          border>
          <el-table-column
            v-for="index in Array( cols )"
            :key="index"
            size="mini"
            align="center"
            width="20">
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import MixinView from "../../core/mixin/View.js"

export default {
    mixins: [ MixinView ],

    name: 'RealMemoryView2',

    data() {
        return {
            title: '内存数据视图',
            rows: 20,
            cols: 16,
            tableData: [],
        }
    },

    mounted () {
        for ( let i = 0; i < this.rows ; i ++ ) {
            let row = []
            for ( let j = 0; j < this.cols; j ++ )
                row.push( Math.random() > 0.5 ? 1 : 0 )
            this.tableData.push( row )
        }
    },

    methods: {
        cellStyle ( data ) {
            return data.row[ data.columnIndex ] ? { backgroundColor: '#909399' } : {}
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.m-body {
  width: 100%;
}

.m-header {
    font-size: 1.6rem;
    width: 100%;
    text-align: center;
    padding: 16px;
}
</style>
