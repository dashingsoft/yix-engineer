<template>
  <div
    class="y-view"
    v-show="visible">

    <div class="titlebar">
      <!-- <el-button -->
      <!--   size="mini" -->
      <!--   title="关闭视图" -->
      <!--   @click="toggleView" -->
      <!--   icon="el-icon-close"></el-button> -->
      <el-button
        size="mini"
        title="YIX">
        <img src="../assets/yix-logo.png" style="width: 1rem">
      </el-button>
      <span>{{ title }}</span>
      <div class="toolbox">
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
        <slot name="toolbar">
          <el-dropdown @command="handleCommand">
            <el-button
              size="mini"
              class="el-icon-more el-dropdown-link">
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="activate">设为活动视图</el-dropdown-item>
              <el-dropdown-item command="relate">选择关联视图</el-dropdown-item>
              <el-dropdown-item command="all">显示所有视图</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </slot>
      </div>
    </div>

    <div class="v-body">
      <slot name="body"></slot>
    </div>

  </div>
</template>

<script>
export default {
    name: 'CoreView',
    props: {
        title: String,
        width: {
            type: Number,
            default: 200,
        },
        height: {
            type: Number,
            default: 120
        },
    },
    data() {
        return {
            visible: true,
        }
    },
    methods: {
        toggleView() {
            this.visible = ! this.visible
        },
        handleCommand( cmd ) {
            if ( cmd === 'activate' ) {
                console.log(cmd)
            }
            else if ( cmd === 'relate' ) {
                console.log(cmd)
            }
            else if ( cmd === 'all' ) {
                console.log(cmd)
            }
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.y-view {
    border: 1px #E4E7ED solid;
}

.y-view .titlebar {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 0 0 6px;
    background: #F0F0F0;
    border-bottom: 1px #E4E7ED solid;
}

.y-view .titlebar > * {
    padding-right: 6px;
    flex-grow: 0;
}

.y-view .titlebar > span {
    padding: 6px;
}

.y-view .titlebar > *:first-child {
    padding: 0 9px;
}

.y-view .titlebar > *:last-child {
    padding-right: 0;
    flex-grow: 1;
    text-align: right;
}

.y-view .titlebar button {
    border: 0;
    background: #F0F0F0;
}

.y-view .toolbox {
    display: flex;
    justify-content: right;
    align-items: center;
}

.y-view .toolbox > * {
    margin-right: 9px;
}

.y-view .toolbox img {
    width: 1em;
    height: 1em;
}

.y-view .titlebar > .toolbox > .el-button {
    margin-left: 0;
}

.y-view .selected {
    border-color: #DCDFE6;
}

.y-view .focused {
    border-color: #909399;
}

</style>
