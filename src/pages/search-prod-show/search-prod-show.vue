<template>
  <!--搜索结果页面-->
  <view class="container">

    <!-- 面板区域 -->
    <view class="fixed-box">

      <!-- 搜索框 + 按钮 -->
      <view class="search-bar">

        <view class="search-box">
          <input :value="prodName"
                 class="sear-input"
                 confirm-type="search"
                 placeholder="输入关键字搜索"
                 @confirm="toSearchConfirm"
                 @input="getSearchContent"
          >
          <image class="search-img"
                 src="@/static/images/icon/search.png"
          />
        </view>

      </view>

      <!-- 搜索排序类型 -->
      <view class="tabs">
        <text
          :class="'tab-item complete ' + (sts===0?'on':'')"
          data-sts="0"
          @tap="onStsTap"
        >
          综合
        </text>
        <text
          :class="'tab-item ' + (sts===1?'on':'')"
          data-sts="1"
          @tap="onStsTap"
        >
          销量
        </text>
        <text
          :class="'tab-item ' + (sts===2?'on':'')"
          data-sts="2"
          @tap="onStsTap"
        >
          价格
        </text>
      </view>

    </view>

    <!-- 商品列表 -->
    <view class="prod-list">

      <!-- 纵向列表 -->
      <view class="cont-item">

        <block
          v-for="(item, index) in searchProdList"
          :key="index"
        >
          <view :data-prodid="item.prodId"
                class="show-item"
                @tap="toProdPage"
          >
            <view class="more-prod-pic">
              <image :src="item.pic"
                     class="more-pic"
              />
            </view>

            <view class="prod-text-right">

              <view class="prod-text more">
                {{ item.prodName }}
              </view>

              <view class="prod-price more">
                <text class="big-num">
                  ￥{{ item.price.toString() }}
                </text>
              </view>

            </view>

          </view>

        </block>
      </view>


    </view>
  </view>
</template>


<script setup>
const prodName = ref('')
const sts = ref(0)
const searchProdList = ref([])


//? trigger


onLoad((options) => {
  prodName.value = options.prodName
})


onShow(() => {
  toLoadData()
})


/**
 * 状态点击事件
 */
const onStsTap = (e) => {
  sts.value = e.currentTarget.dataset.sts
  toLoadData()
}


/**
 * 输入商品获取数据
 * @param e
 */
const getSearchContent = (e) => {
  prodName.value = e.detail.value
}


//? 操作


//? 页面跳转


/**
 * 前往商品页面
 * @param e
 */
const toProdPage = (e) => {
  uni.navigateTo({
    url: '/pages/prod/prod?prodid=' + e.currentTarget.dataset.prodid
  })
}


/**
 * 当前搜索页二次搜索
 */
const toSearchConfirm = (e) => {
  if (e.detail.value) {
    let recentSearch = uni.getStorageSync('recentSearch') || []
    recentSearch = recentSearch.filter(item => item !== prodName.value)
    recentSearch.unshift(prodName.value)
    if (recentSearch.length > 10) {
      recentSearch.pop()
    }
    uni.setStorageSync('recentSearch', recentSearch)
  }
  uni.redirectTo({
    url: '/pages/search-prod-show/search-prod-show?prodName=' + e.detail.value
  })
}


//? 加载项目


/**
 * 加载数据
 */
const toLoadData = () => {
  http.request({
    url: '/search/searchProdPage',
    method: 'GET',
    data: {
      current: 1,
      prodName: prodName.value,
      size: 10,
      sort: sts.value
    }
  })
    .then(({data}) => {
      searchProdList.value = data.records
    })
}


</script>

<style lang="scss" scoped>
@use './search-prod-show.scss';
</style>
