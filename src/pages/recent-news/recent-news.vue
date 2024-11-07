<template>
  <!-- 公告列表 -->
  <view class="container">

    <view class="recent-news">

      <block
        v-for="(item, index) in news"
        :key="index"
      >
        <view :data-id="item.id"
              class="news-item"
              @tap="toNewsDetail"
        >
          <view class="news-item-title">
            {{ item.title }}
          </view>
          <view class="news-item-date">
            {{ item.publishTime }}
          </view>
        </view>
      </block>
    </view>

  </view>
</template>

<script setup>
const news = ref([])


onShow(() => {
  // 加载公告
  http.request({
    url: '/shop/notice/noticeList',
    method: 'GET'
  })
    .then(({data}) => {
      news.value = data.records
    })
})


/**
 * 跳转新闻详情
 * @param e
 */
const toNewsDetail = (e) => {
  uni.navigateTo({
    url: '/pages/news-detail/news-detail?id=' + e.currentTarget.dataset.id
  })
}


</script>

<style lang="scss" scoped>
@use './recent-news.scss';
</style>
