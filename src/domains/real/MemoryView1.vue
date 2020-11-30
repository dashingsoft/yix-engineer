<template>
  <div class="i-view">
    <div class="m-view">
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
      <div class="m-body">
        <div>{{ title }}</div>
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
  </div>
</template>

<script>
import MixinView from "../../core/mixin/View.js"


export default {
    mixins: [ MixinView ],

    name: 'RealMemoryView1',

    props: {
        wordSize: {
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
            for ( let i = 0; i < this.wordSize; i ++ )
                a.push( i )
            return a
        },

        displayAddr () {
            return '地址 ' + this.addr.toString()
        },

        displayValue () {
            return '数据 ' + this.value.toString()
        },

        scrollHeight () {
            return this.wordSize === 16 ? 800 : 1200
        }
    },

    data() {
        return {
            title: '内存读写视图',
        }
    },

    mounted() {
    },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.m-view {
    display: flex;
    flex-direction: row;
    width: 300px;
}

.i-pin {
    border-bottom: 2px solid #333;
    padding: 0 6px;
}

.m-body {
    flex-grow: 1;

    border: 2px solid #333;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

</style>
