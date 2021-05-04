<template>
  <router-view />
</template>

<script>
export default {
  name: "App",
  mounted() {
    // 刷新时将store全存浏览器sessionStorage
    window.addEventListener("unload", () => {
      sessionStorage.setItem("state", JSON.stringify(this.$store.state));
    });
  },
};
</script>

<style>
html,
body {
  margin: 0px;
  height: 100%;
}
#app {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
