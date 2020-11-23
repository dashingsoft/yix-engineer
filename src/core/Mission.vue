<template>
  <div>
    <div class="y-cover">
      <el-card class="box-card">
        <div slot="header">
          <span>使命设置</span>
        </div>
      </el-card>
      <el-button
        type="success"
        @click="$emit( 'page', 'mission', changed )"
        round>确定</el-button>
    </div>
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
            changed: false,
        }
    }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.y-cover {
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

.y-cover .box-card {
    width: 400px;
    border-radius: 16px;
}

.y-cover .el-rate {
    padding-top: 8px;
}

.y-cover .el-button {
    width: 80%;
    max-width: 180px;
    margin-top: 30px
}
</style>
