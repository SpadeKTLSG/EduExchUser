<template>
  <view class="container">
    <view>
      <block
        v-for="(item, index) in prodList"
        :key="index"
      >
        <view :data-prodid="item.prodId"
              class="prod-items"
              @tap="toProdPage"
        >
          <view class="hot-imagecont">
            <image
              :src="item.pic"
              class="hotsaleimg"
            />
          </view>

          <view class="hot-text">
            <view class="hotprod-text">
              {{ item.prodName }}
            </view>
          </view>
        </view>

      </block>
      <view
        v-if="!prodList.length"
        class="empty"
      >
        暂未实现
      </view>
    </view>
  </view>
</template>

<script setup>
//Note: 这个是prod商品展示的改版, 被展示在用户收藏里面; 拉取数据仍然是错的, 应该直接从商品进行拉取.

const sts = ref(0) // todo 0: 分组标签商品列表, 1: 新品推荐, 2: 限时特惠, 3: 每日疯抢, 4: 优惠券商品列表, 5: 收藏商品列表
const title = ref('')
const current = ref(1)
const size = ref(10)
const pages = ref(0)
const tagid = ref(0)
const prodList = ref([])


onLoad((options) => {
  current.value = 1
  pages.value = 0
  sts.value = options.sts
  title.value = options.title ? options.title : ''

  if (options.tagid) {
    tagid.value = options.tagid
  }

  if (sts.value === 0) {
    if (options.tagid === 1) {
      uni.setNavigationBarTitle({
        title: '每日上新'
      })
    } else if (options.tagid === 2) {
      uni.setNavigationBarTitle({
        title: '商城热卖'
      })
    } else if (options.tagid === 3) {
      uni.setNavigationBarTitle({
        title: '更多宝贝'
      })
    }
  } else if (sts.value === 1) {
    uni.setNavigationBarTitle({
      title: '新品推荐'
    })
  } else if (sts.value === 2) {
    uni.setNavigationBarTitle({
      title: '限时特惠'
    })
  } else if (sts.value === 3) {
    uni.setNavigationBarTitle({
      title: '每日疯抢'
    })
  } else if (sts.value === 4) {
    uni.setNavigationBarTitle({
      title: '优惠券活动商品'
    })
  } else if (sts.value === 5) {
    uni.setNavigationBarTitle({
      title: '我的收藏商品'
    })
  } else {
    uni.setNavigationBarTitle({
      title: title.value
    })
  }

  loadProdData(options)
})

/**
 * 页面上拉触底事件的处理函数
 */
onReachBottom(() => {
  if (current.value < pages.value) {
    current.value = current.value + 1
    loadProdData()
  }
})


/**
 * 跳转到商品详情页
 */
const toProdPage = (e) => {
  const prodid = e.currentTarget.dataset.prodid
  uni.navigateTo({
    url: '/pages/prod/prod?prodid=' + prodid
  })
}


/**
 * 加载商品数据
 */
const loadProdData = (options) => {
  const stsParam = sts.value

  if (stsParam === 0) {
    // 分组标签商品列表
    getTagProd()
  } else if (stsParam === 1) {
    // 新品推荐
    const url = '/prod/lastedProdPage'
    getActProd(url)
  } else if (stsParam === 2) {
    // 限时特惠
    const url = '/prod/discountProdList'
    getActProd(url)
  } else if (stsParam === 3) {
    // 每日疯抢
    const url = '/prod/moreBuyProdList'
    getActProd(url)
  } else if (stsParam === 4) {
    // 优惠券商品列表
    getProdByCouponId(options.tagid)
  } else if (stsParam === 5) {
    // 收藏商品列表
    getCollectionProd()
  }
}


const getActProd = (url) => {
  uni.showLoading()
  http.request({
    url,
    method: 'GET',
    data: {
      current: current.value,
      size: size.value
    }
  })
    .then(({data}) => {
      let list
      if (data.current === 1) {
        list = data.records
      } else {
        list = prodList.value
        list = list.concat(data.records)
      }
      prodList.value = list
      pages.value = data.pages
      uni.hideLoading()
    })
}

/**
 * 获取我的收藏商品
 */
const getCollectionProd = () => {
  uni.showLoading()
  http.request({
    url: '/p/user/collection/prods',
    method: 'GET',
    data: {
      current: current.value,
      size: size.value
    }
  })
    .then(({data}) => {
      let list
      if (data.current === 1) {
        list = data.records
      } else {
        list = prodList.value
        list = list.concat(data.records)
      }
      prodList.value = list
      pages.value = data.pages
      uni.hideLoading()
    })
}

/**
 * 获取标签列表
 */
const getTagProd = () => {
  uni.showLoading()
  http.request({
    url: '/prod/prodListByTagId',
    method: 'GET',
    data: {
      tagId: tagid.value,
      current: current.value,
      size: size.value
    }
  })
    .then(({data}) => {
      let list
      if (data.current === 1) {
        list = data.records
      } else {
        list = prodList.value.concat(data.records)
      }
      prodList.value = list
      pages.value = data.pages
      uni.hideLoading()
    })
}

/**
 * 获取优惠券商品列表
 */
const getProdByCouponId = (id) => {
  uni.showLoading()
  http.request({
    url: '/coupon/prodListByCouponId',
    method: 'GET',
    data: {
      couponId: id,
      current: current.value,
      size: size.value
    }
  })
    .then(({data}) => {
      let list
      if (data.current === 1) {
        list = data.records
      } else {
        list = prodList.value.concat(data.records)
      }
      prodList.value = list
      pages.value = data.pages
      uni.hideLoading()
    })
}
</script>

<style lang="scss" scoped>
@use './prod-classify.scss';
</style>
