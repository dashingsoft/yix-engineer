<template>
  <div class="i-part" v-bind:style="styleData">
  </div>
</template>

<script>
import MixinDomain from "../../core/mixin/Domain.js"
import MixinEntity from "../../core/mixin/Entity.js"

export default {
    mixins: [ MixinDomain, MixinEntity ],
    name: 'RealScreen',
    props: {
        position: Array,
    },
    data() {
        return {
            title: "显示器",
        }
    },
    computed: {
        styleData () {
            return {
                left: this.position[ 0 ] + 'px',
                top: this.position[ 1 ] + 'px',
                width: '200px',
                height: '200px'
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.i-part {
    background-image: url("../../assets/monitor.svg");
    background-size: cover;
}
</style>
