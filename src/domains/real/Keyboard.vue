<template>
  <div class="keyboard">
  </div>
</template>

<script>
import MixinDomain from "../../core/mixin/Domain.js"
import MixinEntity from "../../core/mixin/Entity.js"

export default {
    mixins: [ MixinDomain, MixinEntity ],
    name: 'RealKeyboard',
    data() {
        return {
            title: "键盘",
        }
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.keyboard {
    width: 128px;
    height: 128px;

    background-image: url("../../assets/keyboard.svg");
    background-size: cover;
}
</style>
