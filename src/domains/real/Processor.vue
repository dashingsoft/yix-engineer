<template>
  <div class="i-part" v-bind:style="style">
  </div>
</template>

<script>
import MixinDomain from "../../core/mixin/Domain.js"
import MixinEntity from "../../core/mixin/Entity.js"

export default {
    mixins: [ MixinDomain, MixinEntity ],

    name: 'RealProcessor',

    props: {
        position: Array,
    },

    data() {
        return {
            title: "处理器",
            wordSize: 16,
            status: '开始执行指令',
            message: 'MOV EAX, [0x00F28098]',
        }
    },

    computed: {
        style () {
            return {
                left: this.position[ 0 ] + 'px',
                top: this.position[ 1 ] + 'px',
                width: '40px',
                height: '40px',
            }
        }
    },

    methods: {

        // 指令 Mov
        doActionMov ( reg, addr ) {
        },

        // 指令 Add
        doActionAdd ( reg, addr ) {
        },

    },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.i-part {
    background-image: url("../../assets/cpu.svg");
    background-size: cover;
}
</style>
