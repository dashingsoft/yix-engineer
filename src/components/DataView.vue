<template>
    <div class="yix-view">
      <div class="yix-titlebar">
        <el-button
          icon="el-icon-close"
          @click="visible = false"
          plain></el-button>
        <span>{{ title }}</span>
        <div class="actiongroup">
          <el-button
            size="mini"
            title="返回"
            icon="el-icon-arrow-left"></el-button>
          <el-button
            size="mini"
            title="上一级"
            icon="el-icon-arrow-up"></el-button>
          <el-dropdown @command="handleViewCommand">
            <el-button
              size="mini"
              class="el-icon-more el-dropdown-link">
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="figure">图形视图</el-dropdown-item>
              <el-dropdown-item command="grid">表格视图</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="yix-view-body">
          <el-table
            size="mini"
            :data="content"
            row-key="id"
            lazy
            :show-header="false"
            :load="loadChildren"
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
            <el-table-column
              prop="title"
              width="auto">
            </el-table-column>
            <el-table-column
              prop="type"
              width="auto">
            </el-table-column>
            <el-table-column
              prop="value">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  icon="el-icon-edit"
                  type="text"
                  @click="handleEdit(scope.$index, scope.row)"></el-button>
                <el-button
                  size="mini"
                  icon="el-icon-delete"
                  type="text"
                  @click="handleDelete(scope.$index, scope.row)"></el-button>
              </template>
            </el-table-column>
          </el-table>
      </div>
    </div>
</template>

<script>

export default {
    name: 'DataView',
    props: {
        content: Object,
        options: Object,
    },
    data() {
        return {
            filename: "",
            visible: true,
        }
    },
    computed: {
        title: function () {
            return this.filename ? this.filename : "未命名"
        },
    },
    mounted() {
    },
    methods: {
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
