export default {
  title: {
    text: '涉案人员分布图',
    x:'center',
    y:'10%',
    textStyle:{
      color:'#f2f2f7',
      fontSize:30
    }
  },
  tooltip: {
    trigger: 'item'
  },
  dataRange: {
    min: 0,
    max: 800,
    x: 'left',
    y: 500,
    text: ['高', '低'],
    color: [
       '#e42515','#f2f2f7'
    ],
    textStyle: {
      color: '#f2f2f7'
    },
    calculable: true
  },
  series: [
    {
      name: '平台数量',
      type: 'map',
      mapType: 'china',
      roam: false,
      itemStyle: {
        normal: { label: { show: true,textStyle: {color:'#303960'} } },
        emphasis: { label: { show: false, textStyle:{
          color:'#00a4ff'
            }} }
      },
      data:[]
    }
  ]
}
