/*
 * @Author: your name
 * @Date: 2021-01-28 10:30:58
 * @LastEditTime: 2021-09-28 11:40:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \fundAnalysis\src\main.js
 */
import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App'
import router from './router'
import VueRouter from 'vue-router'
import dataV from '@jiaminghi/data-view'
import axios from 'axios'
// import 'default-passive-events'
import cytoscape from "cytoscape";
import cxtmenu from 'cytoscape-cxtmenu';
import cola from "cytoscape-cola";
// import avsdf from "cytoscape-avsdf";
import coseBilkent from "cytoscape-cose-bilkent";
import htmlToPdf from './utils/htmlToPdf'
import echarts from 'echarts'

/* 获取服务器ip */
let ipData = ""
if (process.env.NODE_ENV === 'development') {
  ipData = 'https://192.168.66.198:80/zjfx/'
  window.sessionStorage.setItem('wsip', 'wss://192.168.66.198:81/ws/')
  window.sessionStorage.setItem('loginIp', 'https://192.168.66.198:80/zjfxlogin/')
} else {
  axios.get('./ip.json').then(res => {
    window.sessionStorage.setItem('ip', res.data.ip)
    ipData = window.sessionStorage.getItem('ip')
  })
  axios.get('./wsip.json').then(res => {
    window.sessionStorage.setItem('wsip', res.data.wsip)
  })
  axios.get('./login.json').then(res => {
    window.sessionStorage.setItem('loginIp', res.data.ip)
  })
}
setTimeout(function () {
  let instansce = axios.create({
    baseURL: ipData,
    timeout: 100000,
    headers: {
      "Content-Type": "multipart/form-data",
      "Authorization": window.sessionStorage.getItem('token'),
      "Adminname": window.sessionStorage.getItem("username"),
      "basetoken": window.sessionStorage.getItem("baseToken")
    },
    withCredentials: true
  })

  axios.defaults.baseURL = ipData

  // 通过拦截器设置`Authorization` 属性
  axios.interceptors.request.use(config => {
    let token = window.sessionStorage.getItem('token')
    if (token) {
      config.headers.Authorization = token
    }
    let name = window.sessionStorage.getItem('username')
    if (name) {
      config.headers.Adminname = name
    }
    let baseToken = window.sessionStorage.getItem('baseToken')
    if (baseToken) {
      config.headers.basetoken = baseToken
    }
    return config
  })

  const originalPush = VueRouter.prototype.push
  VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
  }
  Vue.use(ElementUI)
  Vue.use(dataV)
  Vue.prototype.$instance = instansce
  Vue.prototype.$http = axios
  Vue.prototype.cytoscape = cytoscape;
  Vue.prototype.$echarts = echarts
  cytoscape.use(cxtmenu);
  Vue.use(htmlToPdf)
  cytoscape.use(cola);
  // cytoscape.use(avsdf);
  cytoscape.use(coseBilkent);

  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
  })

}, 100);//设置定时器 确保在拿到serve上ip后,再初始化axios

Vue.config.productionTip = false;
