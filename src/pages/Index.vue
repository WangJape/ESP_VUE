<template>
  <van-nav-bar
    title="设备列表"
    :right-text="$store.getters.getUserName"
    @click-right="toLogin"
  >
    <template #left>
      <van-popover v-model:show="showConfigPopover">
        <van-stepper
          v-model.number="autoRefreshInterval"
          min="0"
          button-size="30"
          placement="bottom-start"
        />
        <template #reference>
          <span class="van-nav-bar__text">
            {{ loading ? "刷新中..." : autoRefreshCountDown + "秒后刷新" }}
          </span>
        </template>
      </van-popover>
    </template>
  </van-nav-bar>
  <van-pull-refresh v-model="manualLoading" @refresh="getList">
    <DriverCell
      v-for="driver in drivers"
      :key="driver.clientId"
      :driver="driver"
    />
  </van-pull-refresh>
</template>
<script>
import DriverCell from "@/components/DriverCell";
export default {
  name: "Index",
  components: {
    DriverCell,
  },
  data() {
    return {
      showConfigPopover: false,
      manualLoading: false,
      loading: false,
      drivers: [],
      autoRefreshTimer: null, //定时器
      autoRefreshInterval: 5, //刷新间隔
      autoRefreshCountDown: 5, //倒计时
    };
  },
  watch: {
    autoRefreshInterval: function () {
      clearInterval(this.autoRefreshTimer);
      this.setAutoRefreshTimer();
    },
  },
  created() {},
  mounted() {
    this.getList();
    this.setAutoRefreshTimer();
  },
  unmounted() {
    clearInterval(this.autoRefreshTimer);
  },
  methods: {
    getList() {
      this.loading = true;
      const _this = this;
      this.axios
        .get(`http://lurenpeng.cn:8999/state/getAll`)
        .then(function (response) {
          console.log(response);
          const { code, msg, data } = response.data;
          for (let driver of data) {
            //手动处理字段
            driver.loading = false; //增加 加载中标志
            driver.nickName = driver.nickName ? driver.nickName : "未配置"; //处理返回null值
            driver.buttonState = driver.buttonState ? true : false;
            _this.driverAddRows(driver); //格式化echart数据
          }
          _this.drivers = data;
          _this.loading = false;
          _this.manualLoading = false;
          console.table(_this.drivers);
        })
        .catch(function (error) {
          _this.loading = false;
          console.error(error);
        });
    },
    setAutoRefreshTimer() {
      if (this.autoRefreshInterval == 0) {
        //置0则忽略
        return;
      }
      this.autoRefreshCountDown = this.autoRefreshInterval;
      this.autoRefreshTimer = setInterval(() => {
        if (--this.autoRefreshCountDown == 0) {
          this.getList();
          this.autoRefreshCountDown = this.autoRefreshInterval;
        }
      }, 1000);
    },
    toLogin() {
      this.$router.push("/login");
    },
    driverAddRows(driver) {
      const { temperature, humidity } = driver;
      const dataMap = new Map();
      const rows = [];
      for (let time in temperature) {
        dataMap.set(time, {
          时间: time,
          温度: temperature[time],
        });
      }
      for (let time in humidity) {
        let obj = dataMap.get(time);
        obj.湿度 = humidity[time];
      }
      for (let key of dataMap.keys()) {
        rows.push(dataMap.get(key));
      }
      driver.rows = rows;
    },
  },
};
</script>

<style scoped>
.van-pull-refresh {
  flex: 1;
}
</style>