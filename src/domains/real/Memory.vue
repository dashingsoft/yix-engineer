<template>
  <div class="i-part" v-bind:style="style">
  </div>
</template>

<script>
import Vue from "vue"

import MixinDomain from "../../core/mixin/Domain.js"
import MixinEntity from "../../core/mixin/Entity.js"

import VisualMemory from '../visual/Memory.vue'

import RealMemoryView1 from './MemoryView1.vue'
import RealMemoryView2 from './MemoryView2.vue'


export default {
    mixins: [ MixinDomain, MixinEntity ],

    name: 'RealMemory',

    props: {
        position: Array,
    },

    data() {
        return {
            title: "内存",
        }
    },

    computed: {
        style () {
            return {
                left: this.position[ 0 ] + 'px',
                top: this.position[ 1 ] + 'px',
                width: '30px',
                height: '30px',
            }
        }
    },

    mounted() {
        let visualMemory = Vue.extend( VisualMemory )
        let memory = new visualMemory()
        memory.$mount()
        this.mapStack.push( memory )

        let realMemoryView1 = Vue.extend( RealMemoryView1 )
        let view1 = new realMemoryView1( {
            propsData: {
                basestone: this
            }
        } )
        view1.$mount()
        this.viewStack.push( view1 )

        let realMemoryView2 = Vue.extend( RealMemoryView2 )
        let view2 = new realMemoryView2()
        view2.$mount()
        this.viewStack.push( view2 )
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.i-part {
    background-image: url("../../assets/sim.svg");
    background-size: cover;
}
</style>
