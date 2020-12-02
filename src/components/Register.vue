<template>
  <div class="x-register">
    <el-input
      :value="displayValue"
      size="mini">
      <template slot="prefix" v-if="label">{{ label }}</template>
    </el-input>
  </div>
</template>

<script>

export default {
    name: 'Register',
    props: {
        label: String,
        value: {
            type: Number,
            default: 0
        },
        size: {
            type: Number,
            default: 32
        },
    },
    data() {
        return {
            visible: false,
        }
    },
    computed: {
        displaySize () {
            return this.size / 4
        },
        displayValue () {
            return ( '00000000' + this.value.toString( 16 ) ).slice( - this.displaySize )
        }
    },
    methods: {
        handleCancel() {
            this.visible = false
        },
        handleConfirm() {
            this.visible = false
            if ( this.callback )
                this.callback( this.paras )
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.x-register .el-input__inner {
    letter-spacing: 18px;
    border-bottom: 0;
    padding-left: 36px !important;
    background: repeating-linear-gradient(to right, transparent, #FEFEFE 26px, #EBEEF5 1px);
}
</style>
