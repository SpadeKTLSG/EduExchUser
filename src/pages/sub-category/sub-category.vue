<template>
  <!--下方第二个页面 - 分类 todo merge to main one-->
  <view class="container">
    
    <!-- 顶部子分类tab -->
    <scroll-view
      :scroll-into-view="intoView"
      :scroll-with-animation="true"
      class="category-tit"
      scroll-x="true"
    >
      <block
        v-for="(item, index) in subCategoryList"
        :key="index"
      >
        <view
          :id="'sw' + item.categoryId"
          :class="'category-item ' + (item.categoryId===categoryId? 'on':'')"
          :data-id="item.categoryId"
          @tap="onSubCategoryTap"
        >
          {{ item.categoryName }}
        </view>
      </block>
    </scroll-view>

    <!-- 商品列表 -->
    <view class="prod-item">
      <block v-if="prodList.length">
        <block
          v-for="(prod, key) in prodList"
          :key="key"
        >
          <view
            :data-prodid="prod.prodId"
            class="prod-items"
            @tap="toProdPage"
          >
            <view class="hot-imagecont">
              <image
                :src="prod.pic"
                class="hotsaleimg"
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
              </view>
            </view>
          </view>
        </block>
      </block>
      <view
        v-else
        class="empty-wrap"
      >
        暂无商品数据~
      </view>
    </view>
  </view>
</template>

<script setup>
const wxs = number()
const parentId = ref('')
const categoryId = ref(0)
const current = ref(1)
const pages = ref(0)
const intoView = ref('')
const subCategoryList = ref([])
const prodList = ref([])


/**
 * 生命周期函数--监听页面加载
 */
onLoad((options) => {
  parentId.value = options.parentId
  categoryId.value = options.categoryId
  getSubCategory()
  getProdList()
})


/**
 * 页面上拉触底事件的处理函数
 */
onReachBottom(() => {
  if (current.value < pages.value) {
    current.value = current.value + 1
    getProdList()
  }
})


/**
 * 获取顶栏子分类数据
 */
const getSubCategory = () => {
  http.request({
    url: '/category/categoryInfo',
    method: 'GET',
    data: {
      parentId: parentId.value
    }
  })
    .then(({data}) => {
      subCategoryList.value = data
      nextTick(() => {
        intoView.value = 'sw' + categoryId.value
      })
    })
}


/**
 * 根据分类id获取商品列表数据
 */
const getProdList = () => {

  http.request({
    url: '/prod/pageProd',
    method: 'GET',
    data: {
      categoryId: categoryId.value,
      current: current.value,
      size: 10,
      sort: 0,
      isAllProdType: true
    }
  })
    .then(({data}) => {
      prodList.value = data.current === 1 ? data.records : prodList.value.concat(data.records)
      current.value = data.current
      pages.value = data.pages
    })
}

/**
 * 切换顶部分类
 */
const onSubCategoryTap = (e) => {
  categoryId.value = e.currentTarget.dataset.id
  current.value = 1
  pages.value = 0
  intoView.value = 'sw' + e.currentTarget.dataset.id
  getProdList()
}


/**
 * 跳转商品下详情
 */
const toProdPage = (e) => {
  const prodid = e.currentTarget.dataset.prodid
  if (prodid) {
    uni.navigateTo({
      url: '/pages/prod/prod?prodid=' + prodid
    })
  }
}
</script>

<style lang="scss" scoped>
@use "./sub-category.scss";
</style>
