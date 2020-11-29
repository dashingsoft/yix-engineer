<template>
  <div class="i-view">
    <div v-bind:style="{ width: width + 'px', height: height + 'px' }">
      <div class="i-part" v-bind:style="boardStyle">
        <RealProcessor :position="positions.processor"></RealProcessor>
        <RealMemory :position="positions.memory"></RealMemory>
        <RealDisk :position="positions.disk"></RealDisk>
      </div>
      <RealScreen :position="positions.screen"></RealScreen>
      <RealKeyboard :position="positions.keyboard"></RealKeyboard>
    </div>
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

    computed: {
        boardStyle () {
            return {
                border: "1px solid #E4E7ED",
                left: "50px",
                top: "120px",
                right: "340px",
                bottom: "60px",
            }
        }
    },

    data() {
        return {
            title: "计算机",
            width: 600,
            height: 380,
            positions: {
                disk: [ 120, 120 ],
                memory: [ 30, 75 ],
                processor: [ 130, 30 ],
                screen: [ 360, 50 ],
                keyboard: [ 400, 240 ],
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

        normalize () {
        },

    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.i-view {
    border: 1px solid #C0C4CC;
}
</style>
