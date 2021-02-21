<template>
  <div class="y-explorer">
    <div class="x-header">
      <el-button
        size="mini"
        @click="currentLayer = 0"
        :class="{ selected: activeLayer === 0 }">
        实体层</el-button>
      <el-button
        size="mini"
        @click="currentLayer = 1"
        :class="{ selected: activeLayer === 1 }">
        文明层</el-button>
    </div>
    <el-table
      size="mini"
      row-key="_uid"
      ref="table"
      :show-header="false"
      :default-expand-all="true"
      :highlight-current-row="true"
      :data="tableData"
      @current-change="onCurrentChanged"
      :tree-props="{children: 'domainChildren'}">
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
              title="显示详细视图"
              @click="handleItemView(scope.$index, scope.row)"></el-button>
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
                  :command="{ name: 'view', target: scope.row }">
                  当前视图
                </el-dropdown-item>
                <el-dropdown-item
                  v-for="view in scope.row.viewStack"
                  :key="view._uid"
                  :command="{ name: 'view', target: view }">
                  {{ view.title }}
                </el-dropdown-item>
                <el-dropdown-item divided></el-dropdown-item>
                <el-dropdown-item
                  icon="el-icon-delete"
                  :command="{ name: 'delete', target: scope.row }">
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
            currentRows: [ undefined, undefined ],
            activeLayer: 0,
        }
    },

    computed: {
        tableData () {
            return ( this.activeLayer === 0 )
                ?  ( this.mainDomain === null ? [] : [ this.mainDomain ] )
                :  ( ( this.mainDomain === null || this.mainDomain.mapStack.length === 0 )
                     ? [] : [ this.mainDomain.mapStack[ 0 ] ] )
        },
        currentRow: {
            get () {
                return this.currentRows[ this.activeLayer ]
            },
            set ( value ) {
                this.currentRows[ this.activeLayer ] = value
            }
        },
        currentLayer: {
            get () {
                return this.activeLayer
            },
            set ( value ) {
                this.$nextTick( () => {
                    if ( this.currentRow )
                        this.$nextTick( () => this.$refs.table.setCurrentRow( this.currentRow ) )
                } )
                let oldValue = this.tableData[0]
                this.activeLayer = value
                this.$emit( 'layer', 'select', this.tableData[0], oldValue )
            }
        },
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
            this.$refs.table.setCurrentRow( row )
            this.onCurrentChanged( row, this.currentRow )
        },

        handleItemEdit ( index, obj ) {
            this.$emit( 'domain', 'edit', obj )
        },

        handleItemView ( index, obj ) {
            this.$emit( 'domain', 'detail', obj )
        },

        handleItemCommand ( cmd ) {
            if ( cmd.name === 'view' ) {
                this.$emit( 'domain', 'show', cmd.target )
            }

            else if ( cmd.name === 'delete' )
                this.$emit( 'domain', 'delete', cmd.target )
        },

    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

.y-explorer {
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
    background-color: #EBEEF5;
}

.y-explorer .x-header button.selected {
    background-color: unset;
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
