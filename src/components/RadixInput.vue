<template>
  <div class="yix-radix-input">
    <pre
      v-on:click.exact.prevent="changeRadix"
      v-on:click.shift.prevent="changeRadix2">{{ radixPrefix }}</pre>
    <input
      :minlength="minlength"
      :maxlength="maxlength"
      :size="size"
      :value="value2"
      v-on:keydown.exact.space.prevent="changeRadix"
      v-on:keydown.shift.space.prevent="changeRadix2"
      />
  </div>
</template>

<script>

const prefix = {
    10: '',
    16: '0x',
    8: '0',
    2: '0b'
}

export default {
    name: 'RadixInput',
    props: {
        minlength: Number,
        maxlength: Number,
        size: Number,
        value: Number,
        label: {
            type: String,
            default: ''
        },
        radix: {
            type: Number,
            default: 16
        }
    },
    data() {
        return {
            radix2: 16,
        }
    },
    computed: {
        value2() {
            return this.value === undefined ? '' : this.value.toString( this.radix2 )
        },
        radixPrefix() {
            return prefix[ this.radix2 ]
        }
    },
    mounted() {
        this.radix2 = this.radix
    },
    methods: {
        changeRadix() {
            this.radix2 = this.radix2 === 16 ? 10 : 16
        },
        changeRadix2() {
            this.radix2 = this.radix2 === 8 ? 2 : 8
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
pre {
    padding: 0;
    display: inline-block;
    width: 1.2em;
    cursor: pointer;
}
input {
    border-width: 0 0 1px 0;
}
</style>
