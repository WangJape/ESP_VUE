<template>
  <van-nav-bar
    title="用户登录"
    left-text="返回"
    left-arrow
    @click-left="goBack"
  />
  <van-button type="primary" plain @click="doLogin">点我没用</van-button>
</template>
<script>
export default {
  name: "Login",
  components: {},
  data() {
    return {};
  },
  watch: {},
  created() {},
  methods: {
    doLogin() {
      this.$store.dispatch("setUserName", "Jape");
      this.$router.push("/index");
    },
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
</style>