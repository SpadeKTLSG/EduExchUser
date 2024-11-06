<template>
  <view class="container">

    <!-- 顶栏搜索框 -->
    <view class="bg-sear">
      <view class="scrolltop">
        <view
          class="section"
          @tap="toSearchPage"
        >
          <image
            class="search-img"
            src="@/static/images/icon/search.png"
          />
          <text class="placeholder">
            点我搜索
          </text>
        </view>
      </view>
    </view>

    <!-- 页面主功能 -->
    <view class="content">

      <!-- 轮播图 -->
      <swiper
        :circular="true"
        :duration="duration"
        :indicator-active-color="indicatorActiveColor + ' '"
        :indicator-color="indicatorColor"
        :interval="interval"
        class="pic-swiper"
        indicator-active-color="#d1e5fb"
        indicator-dots
        next-margin="20rpx"
        previous-margin="20rpx"
      >
        <block
          v-for="(item, index) in indexImgs"
          :key="index"
        >
          <swiper-item class="banner-item">
            <view class="img-box">
              <image
                :data-prodid="item.relation"
                :src="item.imgUrl"
                class="banner"
                @tap="toProdPage"
              />
            </view>
          </swiper-item>
        </block>
      </swiper>

      <!--核心首页功能-->
      <view class="cat-item">
        <view
          class="item"
          data-sts="1"
          @tap="toClassifyPage"
        >
          <image src="@/static/images/icon/newProd.png"/>
          <text>新品推荐</text>
        </view>
        <view
          class="item"
          data-sts="1"
          @tap="toClassifyPage"
        >
          <image src="@/static/images/icon/timePrice.png"/>
          <text>限时特惠</text>
        </view>
        <view
          class="item"
          data-sts="3"
          @tap="toClassifyPage"
        >
          <image src="@/static/images/icon/neweveryday.png"/>
          <text>每日疯抢</text>
        </view>
        <view
          class="item"
          @tap="toCouponCenter"
        >
          <image src="@/static/images/icon/newprods.png"/>
          <text>领优惠券</text>
        </view>
        <view
          class="item"
          @tap="toCouponCenter"
        >
          <image src="@/static/images/icon/newprods.png"/>
          <text>公告</text>
        </view>
      </view>

    </view>

    <!-- 首页展示商品 -->
    <view v-if="updata"
          class="updata"
    >
      <block
        v-for="(item, index) in taglist"
        :key="index"
      >
        <!-- 提升表 -->
        <view v-if="item.style==='2' && item.prods && item.prods.length"
              class="up-to-date"
        >
          <view class="title">
            <text>{{ item.title }}</text>
            <view
              :data-id="item.id"
              :data-title="item.title"
              class="more-prod-cont"
              data-sts="0"
              @tap="toClassifyPage"
            >
              <text class="more">
                查看更多
              </text>
            </view>
          </view>
          <view class="item-cont">
            <block
              v-for="(prod, index2) in item.prods"
              :key="index2"
            >
              <view
                :data-prodid="prod.prodId"
                class="prod-item"
                @tap="toProdPage"
              >
                <view>
                  <view class="imagecont">
                    <img-show
                      :class-list="['prodimg']"
                      :src="prod.pic"
                    />
                  </view>
                  <view class="prod-text">
                    {{ prod.prodName }}
                  </view>
                  <view class="price">
                    <text class="symbol">
                      ￥
                    </text>
                    <text class="big-num">
                      {{ wxs.parsePrice(prod.price)[0] }}
                    </text>
                    <text class="small-num">
                      .{{ wxs.parsePrice(prod.price)[1] }}
                    </text>
                  </view>
                </view>
              </view>
            </block>
          </view>
        </view>

        <!-- 商城热卖 -->
        <view
          v-if="item.style==='1' && item.prods && item.prods.length"
          class="hot-sale"
        >
          <view class="title">
            <text>{{ item.title }}</text>
            <view
              :data-id="item.id"
              :data-title="item.title"
              class="more-prod-cont"
              data-sts="0"
              @tap="toClassifyPage"
            >
              <text class="more">
                更多
              </text>
              <text class="arrow"/>
            </view>
          </view>

          <view class="hotsale-item-cont">
            <block
              v-for="(prod, index2) in item.prods"
              :key="index2"
            >
              <view
                :data-prodid="prod.prodId"
                class="prod-items"
                @tap="toProdPage"
              >
                <view class="hot-imagecont">
                  <img-show
                    :class-list="['hotsaleimg']"
                    :src="prod.pic"
                  />
                </view>
                <view class="hot-text">
                  <view class="hotprod-text">
                    {{ prod.prodName }}
                  </view>
                  <view class="prod-info">
                    {{ prod.brief }}
                  </view>
                  <view class="prod-text-info">
                    <view class="price">
                      <text class="symbol">
                        ￥
                      </text>
                      <text class="big-num">
                        {{ wxs.parsePrice(prod.price)[0] }}
                      </text>
                      <text class="small-num">
                        .{{ wxs.parsePrice(prod.price)[1] }}
                      </text>
                    </view>
                    <image
                      class="basket-img"
                      src="@/static/images/icon/basket-sel.png"
                    />
                  </view>
                </view>
              </view>
            </block>
          </view>
        </view>

        <!-- 更多宝贝 -->
        <view
          v-if="item.style==='0' && item.prods && item.prods.length"
          class="more-prod"
        >
          <view class="title">
            {{ item.title }}
          </view>
          <view class="prod-show">
            <block
              v-for="(prod, index2) in item.prods"
              :key="index2"
            >
              <view
                :data-prodid="prod.prodId"
                class="show-item"
                @tap="toProdPage"
              >
                <view class="more-prod-pic">
                  <img-show
                    :class-list="['more-pic']"
                    :src="prod.pic"
                  />
                </view>
                <view class="prod-text-right">
                  <view class="prod-text more">
                    {{ prod.prodName }}
                  </view>
                  <view class="prod-info">
                    {{ prod.brief }}
                  </view>
                  <view class="b-cart">
                    <view class="price">
                      <text class="symbol">
                        ￥
                      </text>
                      <text class="big-num">
                        {{ wxs.parsePrice(prod.price)[0] }}
                      </text>
                      <text class="small-num">
                        .{{ wxs.parsePrice(prod.price)[1] }}
                      </text>
                    </view>
                    <image
                      class="basket-img"
                      src="@/static/images/icon/basket-sel.png"
                      @tap.stop="addToCart(prod)"
                    />
                  </view>
                </view>
              </view>
            </block>
          </view>
        </view>
      </block>
    </view>
  </view>

</template>

<script setup>
import ImgShow from "@/components/img-show/img-show.vue"; // 图片展示组件

const wxs = number()
const indicatorColor = ref('#d1e5fb')
const indicatorActiveColor = ref('#1b7dec')
const interval = ref(2000)
const duration = ref(1000)
const indexImgs = ref([])
const seq = ref(0)
const taglist = ref([])
const updata = ref(true)


onLoad(() => {
  getAllData()
})


/**
 * 页面显示时触发
 * ! #ifdef 不是注释! 不要动它不然会崩溃
 */
onShow(() => {
  // #ifdef MP-WEIXIN
  uni.getSetting({
    success(res) {
      if (!res.authSetting['scope.userInfo']) {
        uni.navigateTo({
          url: '/pages/login/login'
        })
      }
    }
  })
  // #endif
  http.getCartCount() // 重新计算购物车总数量
})

onPullDownRefresh(() => {
  // 模拟加载
  setTimeout(() => {
    getAllData()
    uni.stopPullDownRefresh() // 停止下拉刷新
  }, 100)
})

const getAllData = () => {
  http.getCartCount()// 重新计算购物车总数量
  getIndexImgs()
  getTag()
}

const toProdPage = (e) => {
  const prodid = e.currentTarget.dataset.prodid

  if (prodid) {
    uni.navigateTo({
      url: '/pages/prod/prod?prodid=' + prodid
    })
  }
}
/**
 * 加入购物车
 * @param item
 */
const addToCart = (item) => {
  uni.showLoading({
    mask: true
  })
  http.request({
    url: '/prod/prodInfo',
    method: 'GET',
    data: {
      prodId: item.prodId
    }
  })
    .then(({data}) => {
      http.request({
        url: '/p/shopCart/changeItem',
        method: 'POST',
        data: {
          basketId: 0,
          count: 1,
          prodId: data.prodId,
          shopId: data.shopId,
          skuId: data.skuList[0].skuId
        }
      })
        .then(() => {
          uni.hideLoading()
          http.getCartCount() // 重新计算购物车总数量
          uni.showToast({
            title: '加入购物车成功',
            icon: 'none'
          })
        })
    })
}

const toCouponCenter = () => {

  uni.showToast({
    icon: 'none',
    title: '该功能未实现, 跳转至公告列表页'
  })
  nextTick(() => {
    uni.navigateTo({
      url: '/pages/recent-news/recent-news'
    })
  })
}

/**
 * 跳转搜索页
 */
const toSearchPage = () => {
  uni.navigateTo({
    url: '/pages/search-page/search-page'
  })
}

/**
 * 跳转商品页面
 * @param e
 */
const toClassifyPage = (e) => {
  let url = '/pages/prod-classify/prod-classify?sts=' + e.currentTarget.dataset.sts
  const id = e.currentTarget.dataset.id
  const title = e.currentTarget.dataset.title

  if (id) {
    url += '&tagid=' + id + '&title=' + title
  }

  uni.navigateTo({
    url
  })
}

/**
 * 跳转公告列表页面
 */
const onNewsPage = () => {
  uni.navigateTo({
    url: '/pages/recent-news/recent-news'
  })
}

/**
 * 加载轮播图
 */
const getIndexImgs = () => {
  http.request({
    url: '/indexImgs',
    method: 'GET',
    data: {}
  })
    .then(({data}) => {
      indexImgs.value = data
      seq.value = data
    })
}


/**
 * 加载商品标题分组列表
 */
const getTag = () => {
  http.request({
    url: '/prod/tag/prodTagList',
    method: 'GET',
    data: {}
  })
    .then(({data}) => {
      taglist.value = data
      for (let i = 0; i < data.length; i++) {
        updata.value = false
        updata.value = true
        getTagProd(data[i].id, i)
      }
    })
}

const getTagProd = (id, index) => {
  http.request({
    url: '/prod/prodListByTagId',
    method: 'GET',
    data: {
      tagId: id,
      size: 6
    }
  })
    .then(({data}) => {
      updata.value = false
      updata.value = true
      const taglistParam = taglist.value
      taglistParam[index].prods = data.records
      taglist.value = taglistParam
    })
}
</script>

<style lang="scss" scoped>
@use './index.scss';
</style>
