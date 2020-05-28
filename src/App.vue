<template>
  <div id="app">
    <Toolbox></Toolbox>
    <Engineer style="display:none"></Engineer>
    <MemoryView
      :addr="0x6882522"
      :content="memdata"
      :foldaddrs="foldaddrs"
      :selections="selections"
      style="margin-top: 100px; width: 80%; height: 300px"></MemoryView>
  </div>
</template>

<script>
import Toolbox from './components/Toolbox.vue'
import Engineer from './components/Engineer.vue'
import MemoryView from './domains/computer/Memory.vue'

export default {
    name: 'App',
    components: {
        Toolbox,
        Engineer,
        MemoryView
    },
    created() {
        this.memdata.fill( 0xf0 )
    },
    data() {
        return {
            memdata: Array(300),
            selections: [
                {
                    addr: 0x6882526,
                    size: 4
                },
                {
                    addr: 0x6882546,
                    size: 0x42
                },
                {
                    addr: 0x68825b6,
                    size: 0x10
                },
                {
                    addr: 0x68825f0,
                    size: 0x40
                },
            ],
            foldaddrs: [
                {
                    addr: 0x6882546,
                    size: 0x42
                }
            ]
        }
    }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  position: relative;
  overflow: hidden;
}

html, body {
    padding: 0;
    margin: 0;
    overflow: hidden;
}

canvas {
    z-order: -1;
}
</style>
