<template>
  <div class="im-view1 i-view">
    <div>
      <div class="i-pin">
        读/写
      </div>
      <div v-for="(item, index) in items"
           :key="index"
           class="i-pin">
        A{{ index }}
      </div>
    </div>
    <div style="flex-grow: 1">
      <div>{{ displayAddr }}</div>
      <div>{{ msg }}</div>
      <div>{{ displayValue }} </div>
    </div>
    <div>
      <div class="i-pin">
        忙
      </div>
      <div v-for="(item, index) in items"
           :key="index"
           class="i-pin">
        D{{ index }}
      </div>
    </div>
  </div>
</template>

<script>
import MixinView from "../../core/mixin/View.js"

export default {
    mixins: [ MixinView ],

    name: 'RealMemoryView1',

    props: {
        wordsize: {
            type: Number,
            default: 32,
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

        items () {
            let a = []
            for ( let i = 0; i < this.wordsize; i ++ )
                a.push( i )
            return a
        },

        displayAddr () {
            return '地址 ' + this.addr.toString()
        },

        displayValue () {
            return '数据 ' + this.value.toString()
        },

    },

    data() {
        return {
            title: '内存读写视图',
            msg: '内存',
        }
    },

    mounted() {
    },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.im-view1 {
    display: flex;
    width: 300px;
}

.i-view .i-pin {
    border-bottom: 1px solid #333;
}

</style>
