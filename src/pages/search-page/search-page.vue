<template>
  <!--搜索唤起页面-->
  <view class="container">
    <!-- 搜索框 -->
    <view class="search-bar">

      <view class="search-box">
        <input :value="prodName"
               class="sear-input"
               confirm-type="search"
               placeholder="在这里搜索~"
               @confirm="toSearchProdPage"
               @input="getSearchContent"
        >
        <image
          class="search-img"
          src="@/static/images/icon/search.png"
        />
      </view>

      <text class="search-hint"
            @tap="goBackIndex"
      >
        取消
      </text>
    </view>

    <view class="search-display">

      <!-- 搜索历史 -->
      <view v-if="recentSearch && recentSearch.length"
            class="history-search"
      >
        <view class="title-text history-line">
          搜索历史
          <view class="clear-history">
            <image
              src="@/static/images/icon/clear-his.png"
              @tap="clearSearch"
            />
          </view>
        </view>
        <block
          v-for="(item, index) in recentSearch"
          :key="index"
        >
          <view class="his-search-tags">
            <text
              :data-name="item"
              class="tags"
              @tap="onHistSearch"
            >
              {{ item }}
            </text>
          </view>
        </block>
      </view>
    </view>
  </view>
</template>

<script setup>
const hotSearchList = ref([])
const recentSearch = ref([])
const prodName = ref('')


//? trigger

onShow(() => {
  http.request({
    url: '/search/hotSearchByShopId',
    method: 'GET',
    data: {
      number: 10,
      shopId: 1,
      sort: 1
    }
  })
    .then(({data}) => {
      hotSearchList.value = data
    })
  // 获取历史搜索
  getRecentSearch()
})


/**
 * 生命周期函数--监听页面隐藏
 */
onHide(() => {
  prodName.value = ''
})


/**
 * 输入商品名获取数据 || 绑定输入值
 */
const getSearchContent = (e) => {
  prodName.value = e.detail.value
}

/**
 * 点击搜素历史
 */
const onHistSearch = (e) => {
  prodName.value = e.currentTarget.dataset.name
  toSearchProdPage()
}


//? 操作


/**
 * 清空搜索历史
 */
const clearSearch = () => {
  uni.removeStorageSync('recentSearch')
  getRecentSearch()
}

/**
 * 获取历史搜索
 */
const getRecentSearch = () => {
  recentSearch.value = uni.getStorageSync('recentSearch')
}


//? 页面跳转

/**
 * 返回
 */
const goBackIndex = () => {
  uni.navigateBack({
    url: '/pages/search-page/search-page'
  })
}


/**
 * 搜索提交
 */
const toSearchProdPage = () => {
  if (prodName.value.trim()) {
    // 记录到最近搜索(前端实现)
    let recentSearchStorage = uni.getStorageSync('recentSearch') || []
    recentSearchStorage = recentSearchStorage.filter(item => item !== prodName.value)
    recentSearchStorage.unshift(prodName.value)
    if (recentSearchStorage.length > 10) {
      recentSearchStorage.pop()
    }

    // 跳转到搜索结果页面
    uni.setStorageSync('recentSearch', recentSearchStorage)
    uni.navigateTo({
      url: '/pages/search-prod-show/search-prod-show?prodName=' + prodName.value
    })
  }
}


//? 加载项目


</script>

<style lang="scss" scoped>
@use './search-page.scss';
</style>
