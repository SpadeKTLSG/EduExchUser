<template>
  <view class="container">


    <!-- 用户信息 -->
    <view class="userinfo">
      <view class="userinfo-con">
        <view class="userinfo-avatar">
          <image
            :src="picDomain + loginResult.pic"
          />
        </view>
        <view class="userinfo-name">
          <view>{{ loginResult.nickName }}</view>
        </view>
      </view>
    </view>


    <!-- 卖家买家信息  -->
    <view class="list-cont">

      <!-- 订单状态 -->
      <view class="total-order">
        <view class="order-tit">
          <text style="font-weight:bold">
            我的订单
          </text>
          <view
            class="checkmore"
            data-sts="0"
            @tap="toOrderPage"
          >
            <text>查看全部</text>
            <text class="arrowhead"/>
          </view>
        </view>

        <view class="procedure">

          <view class="items"
                data-sts="1"
                @tap="toOrderPage"
          >
            <image src="@/static/images/icon/toPay.png"/>
            <text>待支付</text>
          </view>

          <view class="items"
                data-sts="2"
                @tap="toOrderPage"
          >
            <image src="@/static/images/icon/toDelivery.png"/>
            <text>待发货</text>
          </view>
          <view class="items"
                data-sts="3"
                @tap="toOrderPage"
          >
            <image src="@/static/images/icon/toTake.png"/>
            <text>待收货</text>
          </view>
          <view class="items"
                data-sts="5"
                @tap="toOrderPage"
          >
            <image src="@/static/images/icon/toComment.png"/>
            <text>已完成</text>
          </view>
        </view>
      </view>

      <!-- 用户功能横置列表 -->
      <view class="prod-col">

        <view class="col-item"
              @tap="toCollectionPage"
        >
          <view class="num">
            {{ collectionCount }}
          </view>
          <view class="tit">
            我的收藏
          </view>
        </view>


        <view class="col-item"
              @tap="wait4Fill"
        >
          <view class="num">
            FIXME
          </view>
          <view class="tit">
            TODO
          </view>
        </view>

        <view class="col-item"
              @tap="wait4Fill"
        >
          <view class="num">
            FIXME
          </view>

          <view class="tit">
            TODO
          </view>
        </view>

      </view>


      <!-- 用户功能下方列表功能区域 -->
      <view class="my-menu">

        <view
          class="memu-item"
          @tap="toVoucherCenterPage"
        >
          <view class="i-name">
            <image src="@/static/images/icon/getCoupon.png"/>
            <text>领券部门</text>
          </view>
          <view class="arrowhead"/>
        </view>

        <view
          class="memu-item"
          @tap="toUserVoucherPage"
        >
          <view class="i-name">
            <image src="@/static/images/icon/myCoupon.png"/>
            <text>我的券</text>
          </view>
          <view class="arrowhead"/>
        </view>

        <view
          class="memu-item"
        >
          <view class="i-name">
            <image src="@/static/images/icon/myAddr.png"/>
            <text>个人信息-未实现</text>
          </view>
          <view class="arrowhead"/>
        </view>

      </view>

      <!-- 退出登陆 -->
      <view class="log-out"
            @tap="logout"
      >
        <view class="log-out-n">
          <text>滚出去</text>
        </view>
      </view>


    </view>
  </view>
</template>

<script setup>
//todo : 之后加上个人信息, 直接读取个人UserAllDTO的内容
//todo: 这个页面调用的逻辑是, 首先用户进入的就是登陆页面, 没有存在没有登录的情况. 因此页面删除了未登录的情况

const picDomain = import.meta.env.VITE_APP_RESOURCES_URL // 图片域名
const loginResult = ref('')
const orderAmount = ref('')
const collectionCount = ref(0)


//? trigger


/**
 * 生命周期函数--监听页面显示
 */
onLoad(() => {
  getAllData()
})


//? 操作


/**
 * 退出登录
 */
const logout = () => {
  http.request({
    url: '/logOut',
    method: 'post'
  })
    .then(() => {
      uni.removeStorageSync('loginResult')
      uni.removeStorageSync('token')

      uni.showToast({
        title: '滚出去了',
        icon: 'none'
      })

      setTimeout(() => {
        uni.switchTab({
          url: '/pages/accountLogin/accountLogin'
        })
      }, 1000)
    })
}


//? 页面跳转

/**
 * 跳转领劵中心
 */
const toVoucherCenterPage = () => {
  uni.showToast({
    icon: 'none',
    title: '该功能未实现'
  })
}

/**
 * 跳转我的劵
 */
const toUserVoucherPage = () => {
  uni.showToast({
    icon: 'none',
    title: '该功能未实现'
  })
}


/**
 * 跳转订单列表
 * @param e
 */
const toOrderPage = (e) => {
  const sts = e.currentTarget.dataset.sts
  uni.navigateTo({
    url: '/pages/orderList/orderList?sts=' + sts
  })
}


/**
 * 跳转收藏
 */
const toCollectionPage = () => {
  let url = '/pages/prod-classify/prod-classify?sts=5'
  const id = 0
  const title = '我的收藏商品'
  if (id) {
    url += '&tagid=' + id + '&title=' + title
  }
  uni.navigateTo({
    url
  })
}


/**
 * 空位
 */
const wait4Fill = () => {
  uni.showToast({
    icon: 'none',
    title: '该功能未实现'
  })
}

//? 加载项目

const getAllData = () => {
  showCollectionCount()
  showOrderCount()
  loginResult.value = uni.getStorageSync('loginResult')
}


/**
 * 查询收藏量
 */
const showCollectionCount = () => {
  http.request({
    url: '/p/user/collection/count',
    method: 'GET',
    data: {}
  })
    .then(({data}) => {
      collectionCount.value = data
    })
}


/**
 * 查询订单量 (待定)
 */
const showOrderCount = () => {
  http.request({
    url: '/p/myOrder/orderCount',
    method: 'GET',
    data: {}
  })
    .then(({data}) => {
      orderAmount.value = data
    })
}


</script>

<style lang="scss" scoped>
@use './user.scss';
</style>
