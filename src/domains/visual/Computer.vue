<template>
  <div class="v-computer i-view">
    <div class="symbol">{{ title }}</div>
  </div>
</template>

<script>
import MixinDomain from "../../core/mixin/Domain.js"
import MixinSpirit from "../../core/mixin/Spirit.js"


export default {
    mixins: [ MixinDomain, MixinSpirit ],
    name: 'VisualComputer',
    data() {
        return {
            title: "操作系统",
            width: 120,
            height: 160
        }
    },
    mounted() {
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.v-computer2 {
    width: 120px;
    height: 160px;
    box-shadow: 0px 0px 12px rgba(0,255,255,0.5);
    border: 1px solid rgba(127,255,255,0.25);
    font-family: Helvetica, sans-serif;
    text-align: center;
    line-height: normal;
    cursor: default;
}
.v-computer2 .symbol {
    position: absolute;
    top: 40px;
    left: 0px;
    right: 0px;
    font-size: 60px;
    font-weight: bold;
    color: rgba(255,255,255,0.75);
    text-shadow: 0 0 10px rgba(0,255,255,0.95);
}
</style>
