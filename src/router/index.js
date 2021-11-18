/*
 * @Author: your name
 * @Date: 2020-07-22 12:03:24
 * @LastEditTime: 2021-04-21 17:27:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \fundAnalysisi:\webstorm\证券比武\bwxt\src\router\index.js
 */
import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  { path: '/login', component: () => import('../views/login/login.vue') },
  { path: '/screen', component: () => import('../views/caseManage/screen.vue') },
  {
    path: '/home', component: () => import('../views/home'), children: [
      {
        path: '/caseList',
        component: () => import('../views/caseManage/caseList'),
        meta: { title: '案件列表' }
      },
      {
        path: '/transactionDetails',
        component: () => import('../views/dataGovernance/dataImport/transactionDetails'),
        meta: { title: '数据导入' }
      },
      {
        path: '/accountInfor',
        component: () => import('../views/dataGovernance/dataImport/accountInfor'),
        meta: { title: '开户信息' }
      },
      {
        path: '/dataClean',
        component: () => import('../views/dataGovernance/dataClean/dataClean'),
        meta: { title: '数据快照' }
      },
      {
        path: '/model',
        component: () => import('../views/accountAnalysis/modelComputer/model'),
        meta: { title: '模型计算' }
      },
      {
        path: '/accountDictionary',
        component: () => import('../views/accountAnalysis/accountStatistics/accountDictionary'),
        meta: { title: '账户字典表' }
      },
      {
        path: '/acountCard',
        component: () => import('../views/accountAnalysis/accountStatistics/acountCard'),
        meta: { title: '交易对手汇总（卡号）' }
      },
      {
        path: '/acountName',
        component: () => import('../views/accountAnalysis/accountStatistics/acountName'),
        meta: { title: '交易对手汇总（户名）' }
      },
      {
        path: '/StatisticalStatement',
        component: () => import('../views/accountAnalysis/accountStatistics/StatisticalStatement'),
        meta: { title: '账户统计表' }
      },
      {
        path: '/accountInforSheet',
        component: () => import('../views/accountAnalysis/accountStatistics/accountInforSheet'),
        meta: { title: '账户信息表' }
      },
      {
        path: '/externalCapitalFlow',
        component: () => import('../views/accountAnalysis/trade/externalCapitalFlow'),
        meta: { title: '账户关联分析' }
      },
      {
        path: '/ipmacHome',
        component: () => import('../views/accountAnalysis/trade/ipmac/ipmacHome'),
        meta: { title: 'IPMAC分析' }
      },
      {
        path: '/accountLawAnalysis',
        component: () => import('../views/accountAnalysis/trade/accountLawAnalysis/accountLawAnalysis'),
        meta: { title: '账户规律分析' }
      },
      {
        path: '/accountLawMore',
        component: () => import('../views/accountAnalysis/trade/accountLawAnalysis/aComponents/accountLawMore'),
        meta: { title: '账户规律分析详情页' }
      },
      /* {
        path: '/jydsHome',
        component: () => import('../views/accountAnalysis/trade/accountLawAnalysis/aComponents/jydsHome'),
        meta: { title: '进出分析详情页' }
      }, */
      /* {
        path: '/commonCounterparty',
        component: () => import('../views/accountAnalysis/trade/commonCounterparty'),
        meta: { title: '共同交易对手' }
      }, */
      {
        path: '/timeSliceAnalysis',
        component: () => import('../views/accountAnalysis/trade/timeSliceAnalysis'),
        meta: { title: '时间切片分析' }
      },
      {
        path: '/counterpartyAnalysis',
        component: () => import('../views/accountAnalysis/trade/counterpartyAnalysis'),
        meta: { title: '交易对手分析' }
      },
      {
        path: '/timeSeriesAnalysis',
        component: () => import('../views/accountAnalysis/trade/timeSeriesAnalysis'),
        meta: { title: '时序分析' }
      },
      {
        path: '/abstractRemarkAnalysis',
        component: () => import('../views/accountAnalysis/trade/abstractRemarkAnalysis'),
        meta: { title: '摘要备注分析' }
      },
      {
        path: '/accountGroup',
        component: () => import('../views/accountAnalysis/accountGroup/accountGroup'),
        meta: { title: '账号分组' }
      },
      {
        path: '/linkAnalysis',
        component: () => import('../views/throughAnalysis/linkAnalysis'),
        meta: { title: '链路分析' }
      },
      {
        path: '/loopAnalysis',
        component: () => import('../views/throughAnalysis/loopAnalysis'),
        meta: { title: '环路分析' }
      },
      {
        path: '/IP',
        component: () => import('../views/Model (rule)/IPMAC/IP'),
        meta: { title: 'IP' }
      },
      {
        path: '/MAC',
        component: () => import('../views/Model (rule)/IPMAC/MAC'),
        meta: { title: 'MAC' }
      },
      {
        path: '/money',
        component: () => import('../views/Model (rule)/money/money'),
        meta: { title: '现金匹配分析' }
      },
      {
        path: '/large',
        component: () => import('../views/Model (rule)/errorAnalysis/large'),
        meta: { title: '大额交易' }
      },
      {
        path: '/highTrade',
        component: () => import('../views/Model (rule)/errorAnalysis/highTrade'),
        meta: { title: '高频交易' }
      },
      {
        path: '/active',
        component: () => import('../views/Model (rule)/errorAnalysis/active'),
        meta: { title: '活跃账号' }
      },
      {
        path: '/largeAmountCash',
        component: () => import('../views/Model (rule)/errorAnalysis/largeAmountCash'),
        meta: { title: '大额取现' }
      },
      {
        path: '/fastForwardquickly',
        component: () => import('../views/Model (rule)/errorAnalysis/fastForwardquickly'),
        meta: { title: '快进快出' }
      },
      {
        path: '/test',
        component: () => import('../views/Model (rule)/errorAnalysis/test'),
        meta: { title: '测试账号' }
      },
      {
        path: '/shortTermActive',
        component: () => import('../views/Model (rule)/errorAnalysis/shortTermActive'),
        meta: { title: '短期活跃' }
      },
      {
        path: '/abstractRemark',
        component: () => import('../views/Model (rule)/abstractRemark/abstractRemark'),
        meta: { title: '摘要备注分析' }
      },
      {
        path: '/pendingAccount',
        component: () => import('../views/Model (rule)/pendingAccount/pendingAccount'),
        meta: { title: '待调单账户分析' }
      },
      {
        path: '/sameNetwork',
        component: () => import('../views/Model (rule)/behave/sameNetwork'),
        meta: { title: '同网点账户' }
      },
      {
        path: '/amountFeatures',
        component: () => import('../views/Model (rule)/behave/amountFeatures'),
        meta: { title: '交易金额特征' }
      },
      {
        path: '/range',
        component: () => import('../views/Model (rule)/behave/range'),
        meta: { title: '交易金额区间规律' }
      },
      {
        path: '/time',
        component: () => import('../views/Model (rule)/behave/time'),
        meta: { title: '交易时间规律' }
      },
      {
        path: '/date',
        component: () => import('../views/Model (rule)/behave/date'),
        meta: { title: '交易日期规律' }
      },
      {
        path: '/type',
        component: () => import('../views/Model (rule)/behave/type'),
        meta: { title: '交易类型分析' }
      },
      {
        path: '/collection',
        component: () => import('../views/Model (rule)/typeIdentificate/collection'),
        meta: { title: '归集账户' }
      },
      {
        path: '/transfer',
        component: () => import('../views/Model (rule)/typeIdentificate/transfer'),
        meta: { title: '中转账户' }
      },
      {
        path: '/deposit',
        component: () => import('../views/Model (rule)/typeIdentificate/deposit'),
        meta: { title: '沉淀账户' }
      },
      {
        path: '/rebate',
        component: () => import('../views/Model (rule)/typeIdentificate/rebate'),
        meta: { title: '返利账户' }
      },
      {
        path: '/unidentification',
        component: () => import('../views/Model (rule)/typeIdentificate/unidentification'),
        meta: { title: '未识别账户' }
      },
      {
        path: '/clust',
        component: () => import('../views/Model (rule)/clan/clust'),
        meta: { title: '集群分析' }
      },
      {
        path: '/similar',
        component: () => import('../views/Model (rule)/clan/similar'),
        meta: { title: '相似账号' }
      },
      {
        path: '/report',
        component: () => import('../views/report/report'),
        meta: { title: '报告生成' }
      },
      {
        path: '/identityCard',
        component: () => import('../views/tool/identityCard'),
        meta: { title: '身份证查询工具' }
      },
      {
        path: '/bankCard',
        component: () => import('../views/tool/bankCard'),
        meta: { title: '银行卡查询工具' }
      },
      {
        path: '/telephone',
        component: () => import('../views/tool/telephone'),
        meta: { title: '电话号码查询工具' }
      },
      /* {
        path: '/userlist',
        component: () => import('../views/user/userlist'),
        meta: { title: '用户列表' }
      } */
    ],

    // redirect: '/'
  }, {
    path: '/baogao',
    component: () => import('../views/accountAnalysis/trade/accountLawAnalysis/aComponents/moreCom/baogao.vue'),
    meta: { title: '账号特征汇总报告' }
  },

]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  //     next()  放行    next('/login')  强制跳转
  if (to.path === '/login') return next()
  // 获取token
  let token = window.sessionStorage.getItem('token')
  if (!token) return next('/login')
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})
router.afterEach((to, from, next) => {
  window.scrollTo(0, 0)
})
export default router
