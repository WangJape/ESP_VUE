import { createApp } from 'vue'
import App from './App.vue'
import router from "./router";
import store from "./store";
import axios from "axios";
import vueAxios from "vue-axios";
import * as echarts from 'echarts'
import Vant from 'vant';
import { Notify, Dialog } from 'vant';
import 'vant/lib/index.css';

const app = createApp(App)
app.use(router)
app.use(store)
app.use(vueAxios, axios)
app.use(Vant)
app.use(Notify)
app.use(Dialog)
app.config.globalProperties.$echarts = echarts
app.mount('#app')