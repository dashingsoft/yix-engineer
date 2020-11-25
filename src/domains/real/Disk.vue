<template>
  <div class="i-disk i-view">
  </div>
</template>

<script>
import Vue from "vue"

import MixinDomain from "../../core/mixin/Domain.js"
import MixinEntity from "../../core/mixin/Entity.js"

import RealFile from './File.vue'

export default {
    mixins: [ MixinDomain, MixinEntity ],

    name: 'RealDisk',

    data() {
        return {
            title: "硬盘",
            files: []
        }
    },

    methods: {
        initFile ( filename ) {
            const RealFileObject = Vue.extend( RealFile )
            let file = new RealFileObject( {
                filename: filename
            } )
            file.$mount()
            this.files.push( file )
        },
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.i-disk {
    width: 60px;
    height: 60px;

    background-image: url("../../assets/hdd.svg");
    background-size: cover;
}
</style>
