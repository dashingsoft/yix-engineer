<template>
  <div class="i-view">
    <div class="m-view">
      {{ title }}
    </div>
  </div>
</template>

<script>
import Vue from "vue"

import MixinDomain from "../../core/mixin/Domain.js"
import MixinSpirit from "../../core/mixin/Spirit.js"

import VisualMemoryView1 from './MemoryView1.vue'


export default {
    mixins: [ MixinDomain, MixinSpirit ],
    name: 'VisualMemory',
    props: {
        basestone: Object,
    },
    data() {
        return {
            title: "内存空间",
        }
    },
    mounted() {
        let visualMemoryView1 = Vue.extend( VisualMemoryView1 )
        let view = new visualMemoryView1()
        view.$mount()
        this.viewStack.push( view )
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
