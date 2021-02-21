<template>
  <div>
    <div class="y-controlbox y-topbar">
      <el-button-group>
        <el-button
          title="开始和继续"><img src="../assets/play.svg"/></el-button>
        <el-button
          title="暂停"><img src="../assets/pause.svg"/></el-button>
        <el-button
          title="终止"><img src="../assets/stop.svg"/></el-button>
      </el-button-group>
      <el-button-group>
        <el-button
          title="返回到上一级"><img src="../assets/skip-start.svg"/></el-button>
        <el-button
          title="跳过当前过程"><img src="../assets/skip-end.svg"/></el-button>
      </el-button-group>
      <el-button-group>
        <el-button
          title="关联窗口模式"><img src="../assets/layers.svg"/></el-button>
        <el-button
          title="缩略图"><img src="../assets/pip.svg"/></el-button>
        <el-button
          title="显示布局窗口" @click="$emit( 'page', 'layout' )">
          <img src="../assets/view-list.svg"/>
        </el-button>
      </el-button-group>
      <el-button-group>
        <el-button
          title="全屏模式"><img src="../assets/fullscreen.svg"/></el-button>
        <el-button
          @click="$emit( 'living', 'viewport', 0 )"
          title="返回"><img src="../assets/cursor.svg"/>
        </el-button>
      </el-button-group>
    </div>
  </div>
</template>

<script>

export default {
    name: 'ControlBox',

    props: {
        mode: Number,
        state: Number,
    },

    computed: {
        isRunning () {
            return this.state === 2
        }
    }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
