<template>
  <div class="y-layoutbox" @click="$emit( 'hide' )">
    <div v-for="(item, index) in scenes" :key="index"
         v-bind:style="{ backgroundImage: item.image }"
         @click.stop="$emit( 'select', index )">
      <el-button type="text" title="关闭" icon="el-icon-close"
                 @click.stop="$emit( 'remove', index )"></el-button>
    </div>
  </div>
</template>

<script>


export default {
    name: 'ScenesPage',

    props: {
        scenes: Array,
    },

    mounted() {
    },

    methods: {
    }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
