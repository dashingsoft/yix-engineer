<template>
  <div class="yix-toolbox">
    <button
      @click="handleRun">运行</button>
    <button
      @click="handlePause">暂停</button>
    <button
      @click="handleStep">单步</button>
  </div>
</template>

<script>
export default {
  name: 'Toolbox',
  props: {
    target: Object
  },
  methods: {
      handleRun() {
          var rect = this.$el.getBoundingClientRect()
          alert(rect.width)
      },
      handlePause() {
      },
      handleStep() {
      },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.yix-toolbox {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    
    display: flex;
    flex-direction: row;
    justify-content: center;
}

.yix-toolbox > * {
    margin: 9px 16px;
    padding: 6px;
}
</style>
