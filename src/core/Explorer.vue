<template>
  <div class="y-explorer">
    <el-table
      size="mini"
      row-key="_uid"
      ref="table"
      :highlight-current-row="true"
      :data="tableData"
      :show-header="false"
      @current-change="onCurrentChanged"
      :tree-props="{children: '$children'}">
      <el-table-column
        prop="title"
        width="auto">
      </el-table-column>
      <el-table-column align="right">
        <template slot-scope="scope">
          <div class="minibar">
            <el-button
              size="mini"
              icon="el-icon-turn-off"
              type="text"
              title="显示/隐藏视图"
              @click="handleEdit(scope.$index, scope.row)"></el-button>
            <el-button
              size="mini"
              icon="el-icon-delete"
              type="text"
              title="删除空间"
              @click="handleDelete(scope.$index, scope.row)"></el-button>
            <el-button
              size="mini"
              icon="el-icon-edit"
              type="text"
              title="修改空间属性"
              @click="handleEdit(scope.$index, scope.row)"></el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
// import CoreView from "./View.vue"

export default {
    name: 'ExplorerView',

    props: {
        mainDomain: Object,
    },

    data() {
        return {
            title: '域空间管理器',
            currentRow: null,
        }
    },

    computed: {
        tableData () {
            return this.mainDomain === null ? [] : [ this.mainDomain ]
        },
    },

    methods: {

        onCurrentChanged ( row, oldRow ) {
            if ( oldRow )
                oldRow.$el.classList.remove( 'i-selected' )
            row.$el.classList.add( 'i-selected' )
            this.currentRow = row
            this.$emit( 'domain', 'select', row, oldRow )
        },

        setCurrentDomain ( row ) {
            if ( this.currentRow !== row ) {
                this.currentRow = row
                this.$refs.table.setCurrentRow( row )
            }
        },

        handleEdit ( index, obj ) {
            console.log( index + obj.title )
            this.$emit( 'domain', 'edit', obj )
        },

        handleDelete ( index, obj ) {
            console.log( index + obj.title )
        },

    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

.y-explorer {
    border: 1px #DCDFE6 solid;
    height: 100%;
}

.y-explorer .minibar {
    opacity: .5;
}

.y-explorer .minibar:hover {
    opacity: 1;
}

.y-explorer .minibar > .el-button {
    margin-left: 20px;
}

.y-explorer .minibar  i.el-icon-delete {
    color: #F56C6C;
}

</style>
