<template>
  <div class="y-explorer">
    <el-table
      size="mini"
      row-key="_uid"
      :highlight-current-row="true"
      :data="tableData"
      :show-header="false"
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

    components: {

    },

    props: {
        mainDomain: Object,
    },

    data() {
        return {
            title: '域空间管理器',
        }
    },

    computed: {
        tableData: function () {
            return this.mainDomain === null ? [] : [ this.mainDomain ]
        },
    },

    methods: {

        loadChildren ( row, item, resolve ) {
            if ( item )
                resolve( item.domainChildren )
            else
                resolve( this.mainDomain )
        },

        handleEdit ( index, obj ) {
            console.log( index + obj.title )
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
