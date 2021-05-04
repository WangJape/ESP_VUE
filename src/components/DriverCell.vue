<template>
  <van-swipe-cell>
    <template #left>
      <van-button
        square
        type="danger"
        text="删除"
        class="swipe-button"
        @click="doDelete"
      />
      <van-button
        square
        type="primary"
        text="配置"
        class="swipe-button"
        @click="showUpdatePopup"
      />
    </template>
    <van-card
      thumb="https://img.yzcdn.cn/vant/cat.jpeg"
      @click="showDetailPopup"
    >
      <template #title>
        <van-row justify="space-between">
          <van-col>
            <h3>{{ driver.nickName }}</h3>
            &nbsp;
            <van-tag plain :type="driver.state === true ? 'success' : 'danger'">
              {{ driver.state === true ? "在线" : "离线" }}
            </van-tag>
          </van-col>
          <van-col></van-col>
        </van-row>
      </template>
      <template #desc>
        <van-row>
          <van-col span="12">
            <van-icon name="description" size="12" />&nbsp;{{ driver.clientId }}
          </van-col>
          <van-col span="12">
            <van-icon name="location-o" size="12" />&nbsp;{{ driver.ipAddress }}
          </van-col>
        </van-row>
        <van-row>
          <van-col span="12">
            <van-icon name="smile-o" size="12" />&nbsp;{{ driver.userName }}
          </van-col>
          <van-col span="12"> </van-col>
        </van-row>
        <van-row justify="space-between">
          <van-col>
            <van-icon name="passed" size="12" />&nbsp;{{ driver.lastLogonTime }}
          </van-col>
          <van-col>
            <van-switch
              v-if="driver.type === 'BTN'"
              v-model="driver.buttonState"
              @change="doSwitch()"
              :loading="driver.loading"
              active-color="#13ce66"
              inactive-color="#ff4949"
              size="24px"
            />
            <van-button
              v-else
              plain
              type="primary"
              size="small"
              @click="showChartPopup"
            >
              <van-icon name="chart-trending-o" />&nbsp;数据
            </van-button>
          </van-col>
        </van-row>
      </template>
    </van-card>
  </van-swipe-cell>
  <van-action-sheet
    v-model:show="chartPopupShow"
    :title="`[${driver.nickName}]的数据`"
  >
    <THLineChart :id="`thLineChart-${driver.clientId}`" :rows="driver.rows" />
  </van-action-sheet>
  <van-action-sheet
    v-model:show="updatePopupShow"
    :title="`配置[${driver.clientId}]`"
  >
    <van-form @submit="doUpdate">
      <van-field
        v-model="tempDriver.nickName"
        name="设备名"
        label="设备名"
        clearable
        :rules="[{ required: true, message: '请填写设备名' }]"
      />
      <div style="margin: 16px">
        <van-button round block type="primary" native-type="submit">
          提交
        </van-button>
      </div>
    </van-form>
  </van-action-sheet>
  <van-action-sheet
    v-model:show="detailPopupShow"
    :title="`[${driver.nickName}]的详情`"
  >
    <van-row justify="end">
      <van-col>
        <span class="detail-lable">设备ID:</span>
      </van-col>
      <van-col span="16">
        <span class="detail-content">{{ driver.clientId }}</span>
      </van-col>
    </van-row>
    <van-row justify="end">
      <van-col>
        <span class="detail-lable">设备昵称:</span>
      </van-col>
      <van-col span="16">
        <span class="detail-content">{{ driver.nickName }}</span>
      </van-col>
    </van-row>
    <van-row justify="end">
      <van-col>
        <span class="detail-lable">所属用户:</span>
      </van-col>
      <van-col span="16">
        <span class="detail-content">{{ driver.userName }}</span>
      </van-col>
    </van-row>
    <van-row justify="end">
      <van-col>
        <span class="detail-lable">类型:</span>
      </van-col>
      <van-col span="16">
        <span class="detail-content">{{ driver.type }}</span>
      </van-col>
    </van-row>
    <van-row justify="end">
      <van-col>
        <span class="detail-lable">保活时间:</span>
      </van-col>
      <van-col span="16">
        <span class="detail-content">{{ driver.keepAlive }}</span>
      </van-col>
    </van-row>
    <van-row justify="end">
      <van-col>
        <span class="detail-lable">IP地址:</span>
      </van-col>
      <van-col span="16">
        <span class="detail-content">{{ driver.ipAddress }}</span>
      </van-col>
    </van-row>
    <van-row justify="end">
      <van-col>
        <span class="detail-lable">最后上线时间:</span>
      </van-col>
      <van-col span="16">
        <span class="detail-content">{{ driver.lastLogonTime }}</span>
      </van-col>
    </van-row>
    <van-row justify="end">
      <van-col>
        <span class="detail-lable">最后下线时间:</span>
      </van-col>
      <van-col span="16">
        <span class="detail-content">{{ driver.lastLogoffTime }}</span>
      </van-col>
    </van-row>
  </van-action-sheet>
</template>
<script>
import THLineChart from "@/components/THLineChart";
export default {
  name: "DriverCell",
  components: {
    THLineChart,
  },
  props: {
    driver: {
      type: Object,
      default: () => {},
      /*
        {   
            "clientId":"BTN-8266-01",
            "nickName": null,
            "userName":"weipeng",
            "ipAddress":"120.244.224.101",
            "keepAlive":15,
            "ts":"2021-04-20 21:10:36",
            "state":false,
            "type":"BTN",
            "buttonState":null
        }
      */
    },
  },
  data() {
    return {
      detailPopupShow: false,
      chartPopupShow: false,
      tempDriver: {}, //临时设备对象，用于更新操作
      updatePopupShow: false,
    };
  },
  watch: {},
  created() {},
  methods: {
    doSwitch() {
      this.driver.loading = true;
      const _this = this;
      //http://192.168.1.11:8999/sync/mqtt_topic_001/btn
      this.axios
        .get(
          `http://lurenpeng.cn:8999/push/btn/sync?clientId=${this.driver.clientId}`
        )
        .then(function (response) {
          console.log(response);
          const { code, msg, data } = response.data;
          if (code === 0) {
            _this.driver.buttonState = data[0].buttonState;
            _this.driver.loading = false;
            _this.$notify({
              type: "success",
              message: `操作[ ${_this.driver.clientId} ]成功`,
            });
          } else {
            _this.$notify({
              type: "danger",
              message: `操作[ ${_this.driver.clientId} ]失败`,
            });
            _this.$parent.getList();
          }
        })
        .catch(function (error) {
          _this.driver.loading = false;
          console.error(error);
        });
    },
    doDelete() {
      const _this = this;
      this.$dialog
        .confirm({
          title: `删除[ ${_this.driver.clientId} ]`,
          message: "确定删除设备的注册信息吗？",
        })
        .then(() => {
          _this.axios
            .get(
              `http://lurenpeng.cn:8999//state/remove/${_this.driver.clientId}`
            )
            .then(function (response) {
              console.log(response);
              const { code, msg, data } = response.data;
              if (code === 0) {
                _this.$notify({
                  type: "success",
                  message: `删除[ ${_this.driver.clientId} ]成功`,
                });
                _this.$parent.getList();
              } else {
                _this.$notify({
                  type: "danger",
                  message: `删除[ ${_this.driver.clientId} ]失败`,
                });
              }
            })
            .catch(function (error) {
              console.error(error);
            });
        })
        .catch(() => {
          // on cancel
        });
    },
    doUpdate() {
      const _this = this;
      this.axios
        .get(
          `http://lurenpeng.cn:8999//state/setNickName/${this.tempDriver.clientId}?nickName=${this.tempDriver.nickName}`
        )
        .then(function (response) {
          console.log(response);
          const { code, msg, data } = response.data;
          if (code === 0) {
            _this.$notify({
              type: "success",
              message: `更新[ ${_this.tempDriver.clientId} ]成功`,
            });
            _this.updatePopupShow = false;
            _this.$parent.$parent.getList();
          } else {
            _this.$notify({
              type: "danger",
              message: `更新[ ${_this.tempDriver.clientId} ]失败`,
            });
          }
        })
        .catch(function (error) {
          console.error(error);
        });
    },
    showDetailPopup(e) {
      e.stopPropagation();
      this.detailPopupShow = true;
    },
    showChartPopup(e) {
      e.stopPropagation();
      this.chartPopupShow = true;
    },
    showUpdatePopup(e) {
      e.stopPropagation();
      this.tempDriver = { ...this.driver };
      this.updatePopupShow = true;
    },
  },
};
</script>

<style scoped>
h3 {
  margin-top: 0;
  margin-bottom: 5px;
  display: inline-block;
}
.van-row {
  margin: 0 0 3px;
}
.swipe-button {
  height: 100%;
}
.detail-lable {
  line-height: 100%;
  margin: 0 10px;
  color: #99a9bf;
  font-size: 13px;
}
.detail-content {
  font-size: 13px;
}
</style>