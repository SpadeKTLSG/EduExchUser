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
        :duration=1000
        :interval=3000
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
          @tap="toProdClassifyPage"
        >
          <image src="@/static/images/icon/newProd.png"/>
          <text>Upshow</text>
        </view>
        <view
          class="item"
          data-sts="1"
          @tap="toProdClassifyPage"
        >
          <image src="@/static/images/icon/timePrice.png"/>
          <text>Hotsearch</text>
        </view>

        <view class="item"
              data-sts="3"
              @tap="toProdClassifyPage"
        >
          <image src="@/static/images/icon/neweveryday.png"/>
          <text>TODO</text>
        </view>


        <view class="item"
              @tap="toVoucherCenter"
        >
          <image src="@/static/images/icon/newprods.png"/>
          <text>领券</text>
        </view>


        <view class="item"
              @tap="toNoticePage"
        >
          <image src="@/static/images/icon/newprods.png"/>
          <text>公告</text>
        </view>
      </view>

    </view>

    <!-- 首页展示区域: Upshow + Hotsearch -->
    <view class="updata">
      <!--      FIXME note: 这里的逻辑不对, 和我的拉取数据策略不一致, 需要未来大改. 这里是一起把所有商品都拉出来, 然后根据他们的
      所谓tag进行分组展示, 但是我的后端是, 直接把对应的Upshow和Hotsearch实体一起拉取出来, 放到对应的位置去, 因此实际上这个方案是没法实现的-->
      <!--    FUTURE  后面直接改成拉取数据时候从对应仓库拉就行了.-->

      <block
        v-for="(item, index) in taglist"
        :key="index"
      >
        <!-- Upshow 大列表 -->
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
              @tap="toProdClassifyPage"
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
                      {{ prod.price.toString() }}
                    </text>
                  </view>
                </view>
              </view>
            </block>
          </view>
        </view>

        <!-- Hotsearch -->
        <view v-if="item.style==='1' && item.prods && item.prods.length"
              class="hot-sale"
        >
          <view class="title">
            <text>{{ item.title }}</text>
            <view
              :data-id="item.id"
              :data-title="item.title"
              class="more-prod-cont"
              data-sts="0"
              @tap="toProdClassifyPage"
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
                      <text class="symbol"> ￥</text>
                      <text class="big-num">
                        {{ prod.price.toString() }}
                      </text>
                    </view>
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
import ImgShow from "@/components/img-show/img-show.vue";
import func from "../../utils/api"; // 图片展示组件

const indexImgs = ref([])
const seq = ref(0)
const taglist = ref([]) //FIXME 没有tag之说

//? trigger

/**
 * 页面加载时触发
 */
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
  func.getCartCount() // 重新计算购物车总数量
})


//? 操作

/**
 * 加入收藏 TODO
 * @param item
 */
const addToCollect = (item) => {

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
          func.getCartCount() // 重新计算购物车总数量
          uni.showToast({
            title: '加入收藏成功',
            icon: 'none'
          })
        })
    })
}


//? 页面跳转

/**
 * 跳转搜索页 TODO
 */
const toSearchPage = () => {
  uni.navigateTo({
    url: '/pages/search-page/search-page'
  })
}

/**
 * 跳转领券 TODO
 */
const toVoucherCenter = () => {
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
 * 跳转商品详情页 TODO
 * @param e
 */
const toProdPage = (e) => {
  const prodid = e.currentTarget.dataset.prodid
  if (prodid) {
    uni.navigateTo({
      url: '/pages/prod/prod?prodid=' + prodid
    })
  }
}

/**
 * 跳转商品页面 TODO
 * @param e
 */
const toProdClassifyPage = (e) => {
  let url = '/pages/prod-classify/prod-classify?sts=' + e.currentTarget.dataset.sts
  const id = e.currentTarget.dataset.id
  const title = e.currentTarget.dataset.title
  //手拼url
  if (id) {
    url += '&tagid=' + id + '&title=' + title
  }

  uni.navigateTo({
    url
  })
}


/**
 * 跳转公告页面 TODO
 */
const toNoticePage = () => {
  uni.navigateTo({
    url: '/pages/recent-news/recent-news'
  })
}


//? 加载项目

/**
 * 获取所有数据
 */
const getAllData = () => {
  func.getCartCount() // 重新计算收藏总数量
  getIndexImgs()
  getTag()
}

/**
 * 加载轮播图  TODO
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
 * 加载商品标题分组列表 TODO 要重写
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
        //getTagProd
        http.request({
          url: '/prod/prodListByTagId',
          method: 'GET',
          data: {
            tagId: data[i].id,
            size: 6
          }
        })
          .then(({data: prodData}) => {
            const taglistParam = taglist.value
            taglistParam[i].prods = prodData.records
            taglist.value = taglistParam
          })
      }
    })
}


</script>

<style lang="scss" scoped>
@use './index.scss';
</style>
