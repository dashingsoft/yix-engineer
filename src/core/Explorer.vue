<template>
  <div class="y-explorer">
    <div class="x-header">
      <el-button
        size="mini"
        @click="activeLayer = 0"
        :class="{ selected: activeLayer === 0 }">
        物理层</el-button>
      <el-button
        size="mini"
        @click="activeLayer = 1"
        :class="{ selected: activeLayer === 1 }">
        文明层</el-button>
    </div>
    <el-table
      v-show="activeLayer === 0"
      size="mini"
      row-key="_uid"
      ref="table"
      :show-header="false"
      :default-expand-all="true"
      :highlight-current-row="true"
      :data="tableData"
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
                  icon="el-icon-check">
                  当前视图
                </el-dropdown-item>
                <el-dropdown-item
                  icon="el-icon-view"
                  v-for="vv in scope.row.viewStack"
                  :key="vv._uid"
                  :command="{ action: 'toggle', item: vv }">
                  {{ vv.title }}
                </el-dropdown-item>
                <el-dropdown-item divided></el-dropdown-item>
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
    <el-table
      v-show="activeLayer === 1"
      size="mini"
      row-key="_uid"
      ref="table"
      :show-header="false"
      :default-expand-all="true"
      :highlight-current-row="true"
      :data="tableData2"
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
                  icon="el-icon-check">
                  当前视图
                </el-dropdown-item>
                <el-dropdown-item
                  icon="el-icon-view"
                  v-for="vv in scope.row.viewStack"
                  :key="vv._uid"
                  :command="{ action: 'toggle', item: vv }">
                  {{ vv.title }}
                </el-dropdown-item>
                <el-dropdown-item divided></el-dropdown-item>
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

export default {
    name: 'ExplorerView',

    props: {
        mainDomain: Object,
    },

    data() {
        return {
            title: '域空间管理器',
            currentRow: null,
            activeLayer: 0,
        }
    },

    computed: {
        tableData () {
            return this.mainDomain === null ? [] : [ this.mainDomain ]
        },
        tableData2 () {
            return ( this.mainDomain === null || this.mainDomain.mapStack.length === 0 )
                ? [] : [ this.mainDomain.mapStack[ 0 ] ]
        }
    },

    methods: {

        onCurrentChanged ( row, oldRow ) {
            if ( oldRow )
                oldRow.$el.classList.remove( 'i-selected' )
            if ( row )
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

.y-explorer .x-header {
    display: flex;
}

.y-explorer .x-header > * {
    flex-grow: 1;
}

.y-explorer .x-header button {
    margin-left: 0;
    border-radius: 0;
    border-width: 0.5px;
}

.y-explorer .x-header button.selected {
    background-color: #EBEEF5;
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
