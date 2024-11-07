<template>

  <view>

    <view class="container">

      <view class="submit-order">

        <!-- 商品详情 -->
        <view class="prod-item">
          <!-- 之后只要选一个就行了 todo -->
          <block
            v-for="(item, index) in orderItems"
            :key="index"
          >

            <!-- 商品详情 -->
            <view :data-ordernum="item.primaryOrderNo"
                  class="item-cont"
            >
              <!-- 图片 -->
              <view class="prod-pic">
                <image :src="item.pic"/>
              </view>

              <view class="prod-info">

                <view class="prodname">
                  {{ item.prodName }}
                </view>

                <view class="price-nums">
                  <text class="prodprice">
                    <text class="symbol">
                      ￥
                    </text>
                    <text class="big-num">
                      {{ item.price.toString() }}
                    </text>
                  </text>
                </view>
              </view>
            </view>
          </block>

        </view>
      </view>

      <!-- 底部栏 -->
      <view class="submit-order-footer">

        <view class="sub-order">

        </view>

        <view class="footer-box"
              @tap="submitOrder"
        >
          发送请求
        </view>
      </view>
    </view>

    <!-- note: todo 选择优惠券, 这里我是放在优惠券的中心进行, 直接选择后对下一次的交易生效即可. 具体就是在落库订单时候, 查看当前用户是否有这个加权即可 -->

  </view>
</template>


<script setup>
const total = ref(0)
const orderItems = ref([])
const totalCount = ref(0)


onShow(() => {
  loadOrderData()
})


/**
 * 提交订单
 */
const submitOrder = () => {
  http.request({
    url: '/p/order/submit',
    method: 'POST',
    data: {
      orderShopParam: [{
        shopId: 1
      }]
    }
  })
    .then(() => {
      uni.showToast({
        title: '提交成功, 请等待商家确认',
        icon: 'success'
      })
    })
}


/**
 * 加载订单数据
 */
const loadOrderData = () => {

  http.request({
    url: '/p/order/confirm',
    method: 'POST',
    data: {
      orderItem: JSON.parse(uni.getStorageSync('orderItem')),
      userChangeCoupon: 1
    }
  })
    .then(({data}) => {
      let orderItemsData = []
      data.shopCartOrders[0].shopCartItemDiscounts?.forEach(itemDiscount => {
        orderItemsData = orderItems.value?.concat(itemDiscount.shopCartItems)
      })
      orderItems.value = orderItemsData
      total.value = data.total
      totalCount.value = data.totalCount
    })
}


</script>

<style lang="scss" scoped>
@use './submit-order.scss';
</style>
