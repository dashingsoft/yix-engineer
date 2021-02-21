<template>
  <div class="i-view">
    <div class="m-view i-chip">
      <div class="m-body">
        <div class="m-left">
          <Register
            label="EAX"
            :value="registers.eax"
            :size="32"></Register>
          <Register
            label="EBX"
            :value="registers.ebx"
            :size="32"></Register>
          <Register
            label="ECX"
            :value="registers.ecx"
            :size="32"></Register>
          <Register
            label="EDX"
            :value="registers.edx"
            :size="32"></Register>
          <Register
            label="ESP"
            :value="registers.esp"
            :size="32"></Register>
          <Register
            label="EBP"
            :value="registers.ebp"
            :size="32"></Register>
          <Register
            label="EDI"
            :value="registers.edi"
            :size="32"></Register>
          <Register
            label="ESI"
            :value="registers.esi"
            :size="32"></Register>
        </div>
        <div class="m-center">
          {{ title }}
        </div>
        <div class="m-right">
          <Register
            label="EIP"
            :value="registers.eip"
            class="i-eip"
            :size="32"></Register>
          <div class="m-group">
            <Register
              label="CS"
              :value="registers.cs"
              :size="32"></Register>
            <Register
              label="DS"
              :value="registers.ds"
              :size="32"></Register>
            <Register
              label="ES"
              :value="registers.es"
              :size="32"></Register>
            <Register
              label="SS"
              :value="registers.ss"
              :size="32"></Register>
            <Register
              label="FS"
              :value="registers.fs"
              :size="32"></Register>
            <Register
              label="GS"
              :value="registers.gs"
              :size="32"></Register>
            <Register
              label="EFLAGS"
              :value="registers.eflags"
              class="i-eflags"
              :size="32"></Register>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MixinView from "../../core/mixin/View.js"

import Register from '../../components/Register.vue'


export default {
    mixins: [ MixinView ],

    name: 'ProcessorView',

    components: {
        Register,
    },

    data() {
        return {
            title: 'CPU',
            registers: {
                eip: 0,
                eax: 0,
                ebx: 0,
                ecx: 0,
                edx: 0,
                esp: 0,
                ebp: 0,
                esi: 0,
                edi: 0,
                cs: 0,
                ds: 0,
                ss: 0,
                es: 0,
                fs: 0,
                gs: 0,
                eflags: 0
            },

        }
    },

    mounted () {
    }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.m-view {
    width: 600px;
    border: 1px solid #C0C4CC;
    padding: 32px 16px;
    outline: 0;
}

.m-body {
    display: flex;
    flex-direction: row;
    align-items: stretch;

    background-color: #F0F0F0;
}

.m-body .m-left {
    width: 240px;
}

.m-body .m-right {
    width: 240px;
}

.m-body .m-center {
    flex-grow: 1;
    border: 1px solid #E4E7ED;
    margin: 0 16px;

    text-align: center;
    padding-top: 32px;
}

.i-chip {
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
