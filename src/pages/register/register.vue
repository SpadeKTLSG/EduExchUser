<template>
  <view class="con">
    <!--头像-->
    <image src="@/static/images/icon/head04.png"/>

    <!-- 登录表单 -->
    <view class="login-form">

      <view :class="['item',errorTips===1? 'error':'']">
        <view class="account">
          <text class="input-item">
            账号
          </text>
          <input
            data-type="account"
            placeholder="请输入账号名称"
            placeholder-class="inp-palcehoder"
            type="text"
            @input="getInputVal"
          >
        </view>
        <view
          v-if="errorTips===1"
          class="error-text"
        >
          <text class="warning-icon">
            !
          </text>
          请输入账号！
        </view>
      </view>
      <view :class="['item',errorTips===2? 'error':'']">
        <view class="account">
          <text class="input-item">
            密码
          </text>
          <input
            data-type="password"
            placeholder="请输入密码"
            placeholder-class="inp-palcehoder"
            type="password"
            @input="getInputVal"
          >
        </view>
        <view
          v-if="errorTips===2"
          class="error-text"
        >
          <text class="warning-icon">
            !
          </text>
          请输入密码！
        </view>
      </view>
      <view class="operate">
        <view
          class="to-register"
          @tap="toLogin"
        >
          已有账号？click here!
        </view>
      </view>
    </view>

    <view>
      <button
        class="authorized-btn"
        @tap="toRegister"
      >
        注册
      </button>
      <button
        class="to-idx-btn"
        @tap="toIndex"
      >
        回到首页
      </button>
    </view>
  </view>

</template>

<script setup>

const account = ref('') // 账号
const password = ref('') // 密码
const errorTips = ref(0) // 输入错误提示:  1账号输入  2密码输入


onShow(() => {
  uni.setNavigationBarTitle({  // 头部导航标题
    title: '用户注册'
  })
})


/**
 * 输入框的值
 */
const getInputVal = (e) => {
  const type = e.currentTarget.dataset.type
  if (type === 'account') {
    account.value = e.detail.value
  } else if (type === 'password') {
    password.value = e.detail.value
  }
}


/**
 * 注册
 */
const toRegister = () => {
  if (account.value.length === 0) {
    errorTips.value = 1
  } else if (password.value.length === 0) {
    errorTips.value = 2
  } else {
    errorTips.value = 0

    uni.showLoading() // 显示加载中

    http.request({
      url: '/user/register',
      method: 'post',
      data: {
        userName: account.value,
        passWord: password.value
      }
    })
      .then(() => {
        uni.hideLoading() // 隐藏加载中

        uni.showToast({ // 提示注册成功
          title: '注册成功，请登录',
          icon: 'none',
          duration: 1500
        })
        setTimeout(() => {
          uni.navigateTo({
            url: '/pages/accountLogin/accountLogin'
          })
        }, 1800)
      })
  }
}
/**
 * 去登陆
 */
const toLogin = () => {
  uni.navigateTo({
    url: '/pages/accountLogin/accountLogin'
  })
}

/**
 * 回到首页
 */
const toIndex = () => {
  uni.switchTab({
    url: '/pages/index/index'
  })
}
</script>

<style lang="scss" scoped>
@use "./register.scss";
</style>
