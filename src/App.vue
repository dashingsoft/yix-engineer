<template>
  <div id="app">
    <Engineer :main-domain="mainDomain" title="运行 foo.c"></Engineer>
  </div>
</template>

<script>
import Vue from "vue"
import Engineer from './core/Engineer.vue'
import RealComputer from './domains/real/Computer.vue'
// import RealComputer from './domains/computer/Machine.vue'


export default {
    name: 'App',
    components: {
        Engineer
    },
    created() {
        const RealComputerObject = Vue.extend( RealComputer )
        this.mainDomain = new RealComputerObject()
        this.mainDomain.$mount()
    },
    data() {
        return {
            mainDomain: null,
        }
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
