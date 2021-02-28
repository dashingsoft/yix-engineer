<template>
  <div class="y-controlbox">
    <el-button
      size="mini"
      title="创建"
      @click="$emit( 'page', 'forge' )"
      icon="el-icon-plus"></el-button>
    <el-button
      size="mini"
      title="动画演示"
      @click="$emit( 'living', 'start' )"
      icon="el-icon-video-camera"></el-button>
    <el-button
      size="mini"
      title="学习研究"
      @click="$emit( 'page', 'learning' )"
      icon="el-icon-reading"></el-button>
    <el-button
      size="mini"
      title="目标设定"
      @click="$emit( 'page', 'mission' )"
      icon="el-icon-alarm-clock"></el-button>
    <el-button
      size="mini"
      title="选项设置"
      @click="$emit( 'page', 'settings' )"
      icon="el-icon-setting"></el-button>
    <el-button
      size="mini"
      title="切换缩略图"
      @click="$emit( 'view', 'overlay' )"
      icon="el-icon-news"></el-button>
    <el-button
      size="mini"
      title="显示视图关联"
      @click="$emit( 'view', 'relation' )"
      icon="el-icon-connection"></el-button>
    <el-button
      size="mini"
      title="切换视图排列"
      @click="$emit( 'domain', 'stack' )"
      icon="el-icon-copy-document"></el-button>
    <el-button
      size="mini"
      title="切换多层视图"
      @click="$emit( 'view', 'layer' )"
      icon="el-icon-coin"></el-button>
  </div>
</template>

<script>

export default {
    name: 'Controlbar',
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
