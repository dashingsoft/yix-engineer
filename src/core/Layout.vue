<template>
  <div class="y-layoutbox"
       v-bind:style="{ display: isVisible ? 'flex' : 'none' }"
       @click="visible = false">
    <div v-for="(item, index) in viewsets" :key="index"
         v-bind:style="{ backgroundImage: item.image }">
      <el-button type="text" title="关闭" icon="el-icon-close"></el-button>
    </div>
    <div>
      <div class="y-toolbox">
        <el-button type="info" title="简单视图"><img src="../assets/square.svg"/></el-button>
        <el-button type="info" title="主从视图"><img src="../assets/grid-1x2.svg"/></el-button>
        <el-button type="info" title="表格视图"><img src="../assets/grid.svg"/></el-button>
      </div>
      <div><i class="el-icon-plus"></i></div>
    </div>
  </div>
</template>

<script>

export default {
    name: 'LayoutBox',

    props: {
        viewsets: Array
    },

    computed: {
        isVisible () {
            return this.visible
        }
    },

    data() {
        return {
            visible: false
        }
    }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.y-layoutbox {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    z-index: 102;

    display: flex;
    justify-content: center;
    align-items: strech;

    padding: 16px;
    background: #909399;
}

.y-layoutbox > div {
    position: relative;
    width: 160px;
    margin-right: 32px;
    text-align: center;
    border: 1px #DCDFE6 solid;
    background-size: cover;
    background-image: linear-gradient(to bottom, rgba(240,240,220,0.5), rgba(150,152,162,0.8))
}

.y-layoutbox .y-toolbox {
    position: absolute;
    left: 10px;
    right: 10px;
    top: 0;
    bottom: 0;

    display: flex;
    justify-content: center;
    align-items: center;

    opacity: 0;
}

.y-layoutbox .y-toolbox:hover {
    opacity: 1;
}

.y-layoutbox button {
    border: 0;
    padding: 9px 16px;
}

.y-layoutbox img {
    max-width: 100%;
    max-height: 100%;
}

.y-layoutbox .el-button img {
    width: 1em;
    height: 1em;
}

.y-layoutbox .el-icon-plus {
    padding: 32px;
    font-size: 2em;
    color: rgba(48, 48, 48, .3);
}

.y-layoutbox .el-button.el-button--text {
    float: right;
}

</style>
