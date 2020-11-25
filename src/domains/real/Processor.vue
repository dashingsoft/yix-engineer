<template>
  <div class="processor">
  </div>
</template>

<script>
import MixinDomain from "../../core/mixin/Domain.js"
import MixinEntity from "../../core/mixin/Entity.js"

export default {
    mixins: [ MixinDomain, MixinEntity ],

    name: 'RealProcessor',

    data() {
        return {
            title: "处理器",
        }
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.processor {
    width: 40px;
    height: 40px;

    background-image: url("../../assets/cpu.svg");
    background-size: cover;
}
</style>
