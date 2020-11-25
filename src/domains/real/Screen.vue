<template>
  <div class="screen">
  </div>
</template>

<script>
import MixinDomain from "../../core/mixin/Domain.js"
import MixinEntity from "../../core/mixin/Entity.js"

export default {
    mixins: [ MixinDomain, MixinEntity ],
    name: 'RealScreen',
    data() {
        return {
            title: "显示器",
        }
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.screen {
    width: 200px;
    height: 200px;

    background-image: url("../../assets/monitor.svg");
    background-size: cover;
}
</style>
