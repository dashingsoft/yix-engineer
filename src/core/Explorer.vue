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
              icon="el-icon-view"
              type="text"
              title="切换视图模式"
              @click="handleItemViews(scope.$index, scope.row)"></el-button>
            <el-button
              size="mini"
              icon="el-icon-edit"
              type="text"
              title="修改空间属性"
              @click="handleItemEdit(scope.$index, scope.row)"></el-button>
              <el-dropdown
                trigger="hover"
                size="mini"
                @command="handleItemCommand">
                <el-button
                  size="mini"
                  type="text"
                  class="el-icon-more">
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    icon="el-icon-zoom-in"
                    :command="{ action: 'zoomin', item: scope.row }">
                    放大
                  </el-dropdown-item>
                  <el-dropdown-item
                    icon="el-icon-zoom-out"
                    :command="{ action: 'zoomout', item: scope.row }">
                    缩小
                  </el-dropdown-item>
                  <el-dropdown-item
                    icon="el-icon-delete"
                    :command="{ action: 'delete', item: scope.row }">
                    删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
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

        handleItemEdit ( index, obj ) {
            this.$emit( 'domain', 'edit', obj )
        },

        handleItemViews ( index, obj ) {
            console.log( index + obj.title )
        },

        handleItemCommand ( cmd ) {
            if ( cmd.name === 'zoom' ) {
                console.log( 'zoom ' + cmd.row.title )
            }
            else if ( cmd.name === 'delete' ) {
                console.log( 'delete ' + cmd.row.title )
            }
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

.y-explorer .minibar .el-button {
    margin-left: 20px;
}

i.el-icon-delete {
    color: #F56C6C;
}

</style>
