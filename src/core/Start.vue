<template>
  <div>
    <div class="cover">
      <el-card class="box-card">
        <div slot="header">
          <span>{{ title }}</span>
        </div>
        <el-form label-width="auto" size="medium">
          <el-form-item label="全屏模式">
            <el-switch v-model="options.fullScreen"></el-switch>
          </el-form-item>
          <el-form-item label="运行粒度">
            <el-radio-group v-model="options.runLevel">
              <el-radio :label="1">源代码</el-radio>
              <el-radio :label="2">汇编指令</el-radio>
              <el-radio :label="3">微处理器</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="运行速度">
            <el-rate
              :max="10"
              :texts="speedLabels"
              :show-text="true"
              v-model="options.runSpeed"></el-rate>
          </el-form-item>
        </el-form>
      </el-card>
      <el-button
        type="success"
        @click="$parent.run"
        round>开始</el-button>
    </div>
  </div>
</template>

<script>

export default {
    name: 'StartPage',

    props: {
        title: String,
        options: Object,
    },

    data () {
        return {
            speedMax: 10,
            speedLabels: ['最慢', '慢', '慢', '较慢', '较慢', '较快', '较快', '快', '快', '最快'],
        }
    }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.cover {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;

    background-color: rgba(240, 240, 240, .86);
    z-index: 100;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.cover .box-card {
    width: 400px;
    border-radius: 16px;
}

.cover .el-rate {
    padding-top: 8px;
}

.cover .el-button {
    width: 80%;
    max-width: 180px;
    margin-top: 30px
}
</style>
