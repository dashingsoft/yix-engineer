<template>
  <div class="i-view"
       v-bind:style="{ width: width + 'px', height: height + 'px' }">
    <div class="real-board">
      <RealProcessor
        v-bind:style="{ left: relpos.cpu.left + 'px', top: relpos.cpu.top + 'px' }"
        class="part">
      </RealProcessor>
      <RealMemory
        v-bind:style="{ left: relpos.mem.left + 'px', top: relpos.mem.top + 'px' }"
        class="part">
      </RealMemory>
      <RealDisk ref="disk"
                v-bind:style="{ left: relpos.disk.left + 'px', top: relpos.disk.top + 'px' }"
                class="part">
      </RealDisk>
    </div>
    <RealScreen
      v-bind:style="{ left: relpos.screen.left + 'px', top: relpos.screen.top + 'px' }"
      class="part">
    </RealScreen>
    <RealKeyboard
      v-bind:style="{ left: relpos.kbd.left + 'px', top: relpos.kbd.top + 'px' }"
      class="part"></RealKeyboard>
  </div>
</template>

<script>
import Vue from "vue"

import MixinDomain from "../../core/mixin/Domain.js"
import MixinEntity from "../../core/mixin/Entity.js"

import RealDisk from "./Disk.vue"
import RealMemory from "./Memory.vue"
import RealKeyboard from "./Keyboard.vue"
import RealScreen from "./Screen.vue"
import RealProcessor from "./Processor.vue"

import VisualComputer from "../visual/Computer.vue"


export default {
    mixins: [ MixinDomain, MixinEntity ],
    name: 'RealComputer',
    components: {
        RealMemory,
        RealDisk,
        RealKeyboard,
        RealScreen,
        RealProcessor,
    },
    data() {
        return {
            title: "计算机",
            width: 600,
            height: 380,
            relpos: {
                disk: {
                    left: 120,
                    top: 120,
                },
                mem: {
                    left: 30,
                    top: 75,
                },
                cpu: {
                    left: 130,
                    top: 30,
                },
                screen: {
                    left: 360,
                    top: 50,
                },
                kbd: {
                    left: 400,
                    top: 240,
                },
            }
        }
    },

    mounted() {
        const VisualComputerObject = Vue.extend( VisualComputer )
        let computer = new VisualComputerObject( {
            propsData: {
                basestone: this
            }
        } )
        computer.$mount()
        this.mapStack.push( computer )
    },

    methods: {

        initStartup ( filename ) {
            console.log( 'autorun ' + filename )
        },

        initDiskFile ( filename ) {
            this.$refs.disk.initFile( filename )
        },

        start () {
        },

        normalize () {
        },

        loadFile () {
        },

        onEventPower () {
        },

    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.real-board {
    position: absolute;
    border: 1px solid #E4E7ED;
    left: 50px;
    top: 120px;
    right: 340px;
    bottom: 60px;
}

.part {
    position: absolute;
}

</style>
