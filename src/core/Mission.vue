<template>
  <div class="y-cover fx-center">
    <el-card class="y-page">
        <div style="margin: 0; width: 100%; height: 16px">
          <el-button style="float:right; border: 0; margin: 2px 16px"
                     size="medium"
                     icon="el-icon-close"
                     @click="$emit( 'page', 'mission', false )"></el-button>
        </div>
      <div class="y-card">
        <el-table
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            label="目标"
            width="120">
            <template slot-scope="scope">{{ scope.row.date }}</template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="完成条件"
            width="120">
          </el-table-column>
          <el-table-column
            prop="value"
            show-overflow-tooltip>
            <template slot="header">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"></el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-plus"></el-button>
            </template>
            <template slot-scope="scope">
              <el-input
                size="mini"
                v-mode="scope.row.value"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>

export default {
    name: 'MissionPage',

    props: {
        missions: Array,
    },

    data () {
        return {
            tableData: [],
            changed: false,
        }
    }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
