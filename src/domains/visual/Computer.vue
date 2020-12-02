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
.i-view > div {
    height: 300px;
    width: 300px;
    background:
        repeating-linear-gradient(90deg, transparent, transparent 50px,
                                  rgba(255, 127, 0, 0.25) 50px, rgba(255, 127, 0, 0.25) 56px,
                                  transparent 56px, transparent 63px,
                                  rgba(255, 127, 0, 0.25) 63px, rgba(255, 127, 0, 0.25) 69px,
                                  transparent 69px, transparent 116px,
                                  rgba(255, 206, 0, 0.25) 116px, rgba(255, 206, 0, 0.25) 166px),
        repeating-linear-gradient(0deg, transparent, transparent 50px,
                                  rgba(255, 127, 0, 0.25) 50px, rgba(255, 127, 0, 0.25) 56px,
                                  transparent 56px, transparent 63px,
                                  rgba(255, 127, 0, 0.25) 63px, rgba(255, 127, 0, 0.25) 69px,
                                  transparent 69px, transparent 116px,
                                  rgba(255, 206, 0, 0.25) 116px, rgba(255, 206, 0, 0.25) 166px),
        repeating-linear-gradient(-45deg, transparent, transparent 5px,
                                  rgba(143, 77, 63, 0.25) 5px, rgba(143, 77, 63, 0.25) 10px),
        repeating-linear-gradient(45deg, transparent, transparent 5px,
                                  rgba(143, 77, 63, 0.25) 5px, rgba(143, 77, 63, 0.25) 10px);
}
</style>
