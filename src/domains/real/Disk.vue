<template>
  <div class="i-part" v-bind:style="style">
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

    props: {
        position: Array,
    },

    computed: {
        style () {
            return {
                left: this.position[ 0 ] + 'px',
                top: this.position[ 1 ] + 'px',
                width: '60px',
                height: '60px',
                backgroundImage: 'url("../../assets/hdd.svg")',
                backgroundSize: 'cover',
            }
        }
    },

    data() {
        return {
            title: "硬盘",
            files: []
        }
    },

    methods: {

        createFile ( filename ) {
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
</style>
