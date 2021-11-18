//锚点跳转
function goAnchor(selector) {
  let anchor = document.querySelector(selector);//获取元素
  if (anchor) {
    setTimeout(() => {//页面没有渲染完成时是无法滚动的，因此设置延迟
      anchor.scrollIntoView({ block: 'start', behavior: 'smooth'});//js内置方法，可滚动视图到元素位置
    }, 500)
  }
}
export default goAnchor
