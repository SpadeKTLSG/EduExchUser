const func = {


  /**
   *  获取收藏数量
   */
  getCartCount: () => {

    http.request({
      url: '/p/shopCart/prodCount',
      method: 'GET',
      dontTrunLogin: true,
      data: {}
    })
      .then(({data}) => {
        if (data > 0) {
          uni.setTabBarBadge({
            index: 2,
            text: data + ''
          })
          getApp().globalData.totalCartCount = data
        } else {
          uni.removeTabBarBadge({
            index: 2
          })
          getApp().globalData.totalCartCount = 0
        }
      })
  }
}

export default func
