<template>
  <div class="i-view">
    <div class="m-view">
      <div class="m-header">
        <span>{{ title }}</span>
      </div>
      <div class="m-body">
        <span v-for="(node, index) in memnodes" :key="index">
          {{ node }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import MixinView from "../../core/mixin/View.js"

export default {
    mixins: [ MixinView ],

    name: 'RealMemoryView2',

    data() {
        return {
            title: '内存数据视图',
            memnodes: [],
        }
    },

    mounted () {
        for ( let i = 0; i < 640 ; i ++ )
            this.memnodes.push( Math.random() > 0.5 ? 1 : 0 )
    }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.m-view {
}

.m-header {
    font-size: 1.6rem;
    width: 100%;
    text-align: center;
    padding: 16px;
}

.m-body {
    width: 100%;
    padding: 16px;
    border: 1px solid #909399;
}

.m-body span {
    width: 16px;
    height: 16px;
}

</style>
