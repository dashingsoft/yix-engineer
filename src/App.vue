<template>
  <div id="app">
    <Engineer :title="title" ref="engineer"></Engineer>
  </div>
</template>

<script>
import Vue from "vue"
import Engineer from './core/Engineer.vue'
import RealComputer from './domains/real/Computer.vue'


export default {
    name: 'App',
    components: {
        Engineer
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

        let filename = '/Users/jondy/workspace/yix-engineer/test/samples/foo'
        computer.initDiskFile( filename )
        computer.initStartup( filename )

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
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    position: relative;
    overflow: hidden;
    height: 100%;
}

html, body {
    padding: 0;
    margin: 0;
    overflow: hidden;
    height: 100%;
}

canvas {
    z-order: -1;
}

</style>
