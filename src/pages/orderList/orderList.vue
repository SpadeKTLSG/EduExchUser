<template>
  <view class="container">

    <!-- 头部菜单 -->
    <view class="order-tit">

      <text
        :class="sts===0?'on':''"
        data-sts="0"
        @tap="onStsTap"
      >
        全部
      </text>
      <text
        :class="sts===1?'on':''"
        data-sts="1"
        @tap="onStsTap"
      >
        待支付
      </text>
      <text
        :class="sts===2?'on':''"
        data-sts="2"
        @tap="onStsTap"
      >
        待发货
      </text>
      <text
        :class="sts===3?'on':''"
        data-sts="3"
        @tap="onStsTap"
      >
        待收货
      </text>
      <text
        :class="sts===5?'on':''"
        data-sts="5"
        @tap="onStsTap"
      >
        已完成
      </text>
    </view>

    <!-- 主体 -->
    <view class="main">

      <view
        v-if="list.length===0"
        class="empty"
      >
        还没有任何相关订单
      </view>


      <!-- 订单列表 -->
      <block v-for="(item, index) in list"
             :key="index"
      >

        <!--这部分独立来写-->
        <view class="prod-item">
          <view class="order-num">
            <text>订单编号：{{ item.orderNumber }}</text>
            <view class="order-state">
              <text
                :class="'order-sts  ' + (item.status===1?'red':'') + '  ' + ((item.status===5||item.status===6)?'gray':'')"
              >
                {{
                  item.status === 1 ? '待支付' : (item.status === 2 ? '待发货' : (item.status === 3 ? '待收货' : (item.status === 5 ? '已完成' : '已取消')))
                }}
              </text>

              <view
                v-if="item.status===5 || item.status===6"
                class="clear-btn"
              >
                <image
                  :data-ordernum="item.orderNumber"
                  class="clear-list-btn"
                  src="@/static/images/icon/clear-his.png"
                  @tap="delOrderList"
                />
              </view>
            </view>
          </view>


          <!-- 商品列表(一个订单一个商品)-->
          <block
            v-for="(prod, index2) in item.orderItemDtos"
            :key="index2"
          >
            <view>
              <view :data-ordernum="item.orderNumber"
                    class="item-cont"
                    @tap="toOrderDetailPage"
              >
                <view class="prod-pic">
                  <image :src="prod.pic"/>
                </view>

                <view class="prod-info">

                  <view class="prodname">
                    {{ prod.prodName }}
                  </view>
                  <view class="prod-info-cont">
                    {{ prod.skuName }}
                  </view>
                  <view class="price-nums">
                    <text class="prodprice">
                      <text class="symbol">
                        ￥
                      </text>
                      <text class="big-num">
                        {{ prod.price.toString() }}
                      </text>
                    </text>
                    <text class="prodcount">
                      x{{ prod.prodCount }}
                    </text>
                  </view>
                </view>
              </view>
            </view>
          </block>

          <!--针对不同订单进行状态的操作-->
          <view class="prod-foot">

            <view class="btn">

              <text v-if="item.status===1"
                    :data-ordernum="item.orderNumber"
                    class="button"
                    hover-class="none"
                    @tap="onCancelOrder"
              >
                取消订单
              </text>

              <text v-if="item.status===1"
                    :data-ordernum="item.orderNumber"
                    class="button warn"
                    hover-class="none"
              >
                付款(外部支付)
              </text>


              <text v-if="item.status===3"
                    :data-ordernum="item.orderNumber"
                    class="button warn"
                    hover-class="none"
                    @tap="onConfirmReceive"
              >
                确认收货(外部确认)
              </text>

            </view>
          </view>
        </view>
      </block>
    </view>
  </view>


</template>

<script setup>
const sts = ref(0)
const current = ref(1)
const pages = ref(0)
const list = ref([])


//? trigger


onLoad((options) => {
  if (options.sts) {
    sts.value = options.sts
    loadOrderData(options.sts, 1)
  } else {
    loadOrderData(0, 1)
  }
})


/**
 * 页面上拉触底事件
 */
onReachBottom(() => {
  if (current.value < pages.value) {
    loadOrderData(sts.value, current.value + 1)
  }
})


/**
 * 状态点击事件
 */
const onStsTap = (e) => {
  sts.value = e.currentTarget.dataset.sts
  loadOrderData(sts.value, 1)
}


//? 操作


/**
 * 取消订单
 */
const onCancelOrder = (e) => {
  const ordernum = e.currentTarget.dataset.ordernum

  uni.showModal({
    title: '',
    content: '要取消此订单？',
    confirmColor: '#3e62ad',
    cancelColor: '#3e62ad',
    cancelText: '否',
    confirmText: '是',

    success(res) {
      if (res.confirm) {
        http.request({
          url: '/p/myOrder/cancel/' + ordernum,
          method: 'PUT',
          data: {}
        })
          .then(() => {
            loadOrderData(sts.value, 1)
          })
      }
    }
  })
}


/**
 * 确认收货
 */
const onConfirmReceive = (e) => {
  uni.showModal({
    title: '',
    content: '确认已收到货？',
    confirmColor: '#eb2444',

    success(res) {
      if (res.confirm) {
        http.request({
          url: '/p/myOrder/receipt/' + e.currentTarget.dataset.ordernum,
          method: 'PUT'
        })
          .then(() => {
            loadOrderData(sts.value, 1)
          })
      }
    }
  })
}


/**
 * 删除已完成||已取消的订单
 * @param e
 */
const delOrderList = (e) => {
  uni.showModal({
    title: '',
    content: '确定要删除此订单吗？',
    confirmColor: '#eb2444',

    success(res) {
      if (res.confirm) {
        const ordernum = e.currentTarget.dataset.ordernum
        http.request({
          url: '/p/myOrder/' + ordernum,
          method: 'DELETE'
        })
          .then(() => {
            loadOrderData(sts.value, 1)
          })
      }
    }
  })
}


//? 页面跳转

/**
 * 跳转订单详情
 */
const toOrderDetailPage = (e) => {
  uni.navigateTo({
    url: '/pages/order-detail/order-detail?orderNum=' + e.currentTarget.dataset.ordernum
  })
}


//? 加载项目

/**
 * 加载订单数据
 */
const loadOrderData = (sts, currentParam) => {
  http.request({
    url: '/p/myOrder/myOrder',
    method: 'GET',
    data: {
      current: currentParam,
      size: 10,
      status: sts
    }
  })
    .then(({data}) => {
      let listParam
      if (data.current === 1) {
        listParam = data.records
      } else {
        listParam = list.value
        Array.prototype.push.apply(listParam, data.records)
      }
      list.value = listParam
      pages.value = data.pages
      current.value = data.current
    })
}

</script>

<style lang="scss" scoped>
@use './orderList.scss';
</style>
