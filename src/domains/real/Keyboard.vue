<template>
  <div class="i-part" v-bind:style="style">
  </div>
</template>

<script>
import MixinDomain from "../../core/mixin/Domain.js"
import MixinEntity from "../../core/mixin/Entity.js"

export default {
    mixins: [ MixinDomain, MixinEntity ],
    name: 'RealKeyboard',
    props: {
        position: Array,
    },
    data() {
        return {
            title: "键盘",
        }
    },
    computed: {
        style () {
            return {
                left: this.position[ 0 ] + 'px',
                top: this.position[ 1 ] + 'px',
                width: '128px',
                height: '128px',
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.i-part {
    background-image: url("../../assets/keyboard.svg");
    background-size: cover;
}
</style>
