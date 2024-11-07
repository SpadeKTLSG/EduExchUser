<template>
  <!--主容器-->
  <view class="container">

    <!--订单详情-->
    <view class="order-detail">

      <!-- 商品信息 -->
      <view class="prod-item">

        <block
          v-for="(item, index) in orderItemDtos"
          :key="index"
        >

          <!-- 商品列表项目 -->
          <view :data-prodid="item.prodId"
                class="item-cont"
          >
            <!-- 商品图片 -->
            <view class="prod-pic">
              <image :src="item.pic"/>
            </view>

            <!-- 商品信息 -->
            <view class="prod-info">

              <view class="prodname">
                {{ item.prodName }}
              </view>

              <view class="prod-info-cont">
                <text class="number">
                  数量：{{ item.prodCount }}
                </text>
                <text class="info-item">
                  {{ item.skuName }}
                </text>
              </view>

              <view class="price-nums clearfix">
                <text class="prodprice">
                  <text class="symbol">
                    ￥
                  </text>
                  <text class="big-num">
                    {{ wxs.parsePrice(item.price)[0] }}
                  </text>
                  <text class="small-num">
                    .{{ wxs.parsePrice(item.price)[1] }}
                  </text>
                </text>
                <view class="btn-box"/>
              </view>
            </view>
          </view>
        </block>
      </view>

      <!-- 订单信息 -->
      <view class="order-msg">

        <view class="msg-item">
          <view class="item">
            <text class="item-tit">
              下单时间：
            </text>
            <text class="item-txt">
              {{ createTime }}
            </text>
          </view>
        </view>

      </view>

      <view class="order-msg">
        <view class="msg-item">
          <view class="item">
            <view class="item-tit">
              订单总额：
            </view>
            <view class="item-txt price">
              <text class="symbol">
                ￥
              </text>
              <text class="big-num">
                {{ wxs.parsePrice(total)[0] }}
              </text>
              <text class="small-num">
                .{{ wxs.parsePrice(total)[1] }}
              </text>
            </view>
          </view>
        </view>
      </view>

    </view>
  </view>
</template>


<script setup>
const wxs = number()
const orderItemDtos = ref([])
const status = ref(0)
const actualTotal = ref(0)
const createTime = ref('')
const total = ref(0) // 商品总额


//? trigger

/**
 * 生命周期函数--监听页面加载
 */
onLoad((options) => {
  loadOrderDetail(options.orderNum)
})


//? 操作

//? 页面跳转

//? 加载项目

/**
 * 加载订单数据
 */
const loadOrderDetail = (orderNum) => {
  uni.showLoading() // 加载订单详情
  http.request({
    url: '/p/myOrder/orderDetail',
    method: 'GET',
    data: {
      orderNumber: orderNum
    }
  })
    .then(({data}) => {
      actualTotal.value = data.actualTotal
      orderItemDtos.value = data.orderItemDtos
      createTime.value = data.createTime
      status.value = data.status
      total.value = data.total
      uni.hideLoading()
    })
}


</script>

<style lang="scss" scoped>
@use './order-detail.scss';
</style>
