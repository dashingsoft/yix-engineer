<template>
  <div class="i-view">
    <div class="m-view">
      <ByteView
        :addr="addr"
        :content="content">
      </ByteView>
    </div>
  </div>
</template>

<script>
import MixinView from "../../core/mixin/View.js"

import ByteView from "../../components/ByteView.vue"


export default {
    mixins: [ MixinView ],

    name: 'RealMemoryView',

    components: {
        ByteView,
    },

    props: {
        wordSize: {
            type: Number,
            default: 16,
        },
        addr: {
            type: Number,
            default: 0
        },
        value: {
            type: Number,
            default: 0
        }
    },

    computed: {

        content () {
            let d = []
            for ( let i = 0; i < 256; i ++ )
                d.push( Math.round( 255 * Math.random() ) )
            return d
        }
    },

    data() {
        return {
            title: '内存数据视图',
        }
    },

    mounted() {
    },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.m-view {
    border: 1px solid #C0C4CC;
    padding: 9px;
}
</style>
