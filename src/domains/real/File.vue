<template>
  <div class="y-file">
  </div>
</template>

<script>
export default {
    name: 'RealFile',
    data() {
        return {
            title: "文件",
        }
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.screen {
    width: 40px;
    height: 40px;

    background-image: url("../../assets/file-text.svg");
    background-size: cover;
}
</style>
