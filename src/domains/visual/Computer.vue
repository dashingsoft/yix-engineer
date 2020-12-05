<template>
  <div class="i-view">
    <div class="m-view">
      <MemoryManager></MemoryManager>
      <ProcessManager></ProcessManager>
      <DeviceManager></DeviceManager>
      <UserTerminal></UserTerminal>
    </div>
  </div>
</template>

<script>
import MixinDomain from "../../core/mixin/Domain.js"
import MixinMeta from "../../core/mixin/Meta.js"

import MemoryManager from './MemoryManager.vue'
import ProcessManager from './ProcessManager.vue'
import DeviceManager from './DeviceManager.vue'
import UserTerminal from './UserTerminal.vue'


export default {
    mixins: [ MixinDomain, MixinMeta ],

    name: 'VisualComputer',

    components: {
        MemoryManager,
        ProcessManager,
        DeviceManager,
        UserTerminal,
    },

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
.m-view {
    border: 2px solid #C0C4CC;
    padding: 16px;
    text-align: center;
}
</style>
