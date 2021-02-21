<template>
  <div id="app">
    <div class="titlebar">
      <!-- <el-button -->
      <!--   size="mini" -->
      <!--   title="关闭视图" -->
      <!--   @click="toggleView" -->
      <!--   icon="el-icon-close"></el-button> -->
      <el-button
        size="mini"
        title="YIX">
        <img src="./assets/yix-logo.png" style="width: 1rem">
      </el-button>
    <span>{{ title }}</span>
    <Controlbar></Controlbar>
    </div>
    <div class="v-body">
      <Engineer :title="title" ref="engineer"></Engineer>
    </div>
  </div>
</template>

<script>
import Vue from "vue"
import Engineer from './core/Engineer.vue'
import Controlbar from './core/Controlbar.vue'
import RealComputer from './domains/real/Computer.vue'

export default {
    name: 'App',
    components: {
        Engineer,
        Controlbar,
    },
    data () {
        return {
            title: '易科引擎'
        }
    },
    mounted () {
        let engineer = this.$refs.engineer
        Vue.prototype.$i_engineer = engineer

        const RealComputerObject = Vue.extend( RealComputer )
        let computer = new RealComputerObject()
        engineer.initMainDomain( computer )

        // let filename = '/Users/jondy/workspace/yix-engineer/test/samples/foo'
        // computer.initDiskFile( filename )
        // computer.initStartup( filename )

        // engineer.missions.push( file )
        // let actions = []
        // Set init action stack:
        //     computer, load, Process( 'foo.exe' )
        //     engineer enter living mode
        //     computer, process.start()
        // engineer.initActionStack( actions )
    }
}
</script>

<style>
html, body {
    padding: 0;
    margin: 0;
    overflow: hidden;
    height: 100%;
}

canvas {
    z-order: -1;
}

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    position: relative;
    overflow: hidden;
    height: 100%;
}

.titlebar {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 0 0 6px;
    background: #F0F0F0;
    border-bottom: 1px #E4E7ED solid;
}

.titlebar > * {
    padding-right: 6px;
    flex-grow: 0;
}

.titlebar > span {
    padding: 6px;
}

.titlebar > *:first-child {
    padding: 0 9px;
}

.titlebar > *:last-child {
    padding-right: 0;
    flex-grow: 1;
    text-align: right;
}

.titlebar button {
    border: 0;
    background: #F0F0F0;
}

.titlebar .selected {
    border-color: #DCDFE6;
}

.titlebar .focused {
    border-color: #909399;
}
</style>
