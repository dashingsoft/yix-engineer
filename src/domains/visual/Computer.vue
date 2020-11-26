<template>
  <div class="i-view">
    <div>{{ title }}</div>
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
        }
    },
    mounted() {
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
