<template>
  <div class="i-view">
    <div class="m-view">
      <div class="m-header">
        <span>{{ title }}</span>
      </div>
      <div class="m-body">
        <div v-for="(addr, index) in addrs" :key="index">
          <div class="i-addr">
            {{ addr }}
          </div>
          <div class="i-data">
            {{ contents[ index ] }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MixinView from "../../core/mixin/View.js"

const hexString = value => ( '00000000' + value.toString( 16 ) ).slice( -8 )

export default {
    mixins: [ MixinView ],

    name: 'VisualMemoryView',

    data() {
        return {
            title: '内存数据视图',
            addrs: [],
            contents: [],
        }
    },

    mounted () {
        let addr = 0
        for ( let i = 0; i < 10 ; i ++, addr += 4 ) {
            this.addrs.push( '0x' + hexString( addr ) )
            this.contents.push( hexString( Math.round( 0xEFFFFFFF * Math.random() ) ) )
        }
        this.contents.pop()
        this.contents.push( '...' )
    }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.m-view {
    width: 360px;
    padding: 16px;
    max-height: 100%;
}

.m-header {
    font-size: 1.6rem;
    width: 100%;
    text-align: center;
    padding: 16px;
}

.m-body > div {
    display: flex;
    flex-direction: row;
}

.m-body > div > div:first-child {
    width: 120px;
}

.m-body > div > div:last-child {
    flex-grow: 1;
}

.m-body .i-addr {
    line-height: 1.6rem;
    padding: 4px;
}

.m-body .i-data {
    line-height: 1.6rem;
    padding: 2px;
    border: 1px solid #909399;
    border-bottom: 0;
    text-align: center;
}

</style>
