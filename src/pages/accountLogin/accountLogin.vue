<template>
  <view class="con">
    <image src="@/static/logo.png"/>

    <!-- 登录 -->
    <view class="login-form">

      <view :class="['item',errorTips===1? 'error':'']">
        <view class="account">
          <text class="input-item">
            账号
          </text>
          <input
            data-type="account"
            placeholder="请输入用户名"
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

      <view :class="['item',errorTips===2 ? 'error':'']">
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
          @tap="toRegitser"
        >
          还没有账号？
          <text>去注册></text>
        </view>
      </view>
    </view>

    <view>
      <button
        class="authorized-btn"
        @tap="login"
      >
        登录
      </button>
      <button
        class="to-idx-btn"
        @tap="toHomepage"
      >
        回到首页
      </button>
    </view>

  </view>
</template>

<script setup>

/**
 * 生命周期函数--监听页面显示
 */
onShow(() => {
  // 头部导航标题
  uni.setNavigationBarTitle({
    title: '用户登录'
  })
})

const account = ref('') // 账号
const password = ref('') // 密码
const errorTips = ref(0) // 错误提示

/**
 *  监听器, 当傻不隆冬的用户开始动弹时, 清理当前的错误提示计数器
 */
watch(
  () => password.value,
  () => {
    errorTips.value = 0
  }
)


/**
 * 获取输入框的值
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
 * 登录
 */
const login = () => {
  if (account.value.length === 0) { //
    errorTips.value = 1
  } else if (password.value.length === 0) {
    errorTips.value = 2
  } else {
    errorTips.value = 0
    http.request({
      url: '/login',
      method: 'post',
      data: {
        userName: account.value,
        passWord: password.value
      }
    })
      .then(({data}) => {
        http.loginSuccess(data, () => {
          uni.showToast({
            title: '登录成功',
            icon: 'none',
            complete: () => {
              setTimeout(() => {
                wx.switchTab({
                  url: '/pages/index/index'
                })
              }, 1000)
            }
          })
        })
      })
  }
}

/**
 * 去注册
 */
const toRegitser = () => {
  uni.navigateTo({
    url: '/pages/register/register'
  })
}

/**
 * 回到首页
 */
const toHomepage = () => {
  wx.switchTab({ //切换页面
    url: '/pages/index/index'
  })
}
</script>

<style lang="scss" scoped>
@use "./accountLogin.scss";
</style>
