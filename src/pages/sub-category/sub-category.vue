<template>
  <!--下方第二个页面 - 分类 todo merge to main one-->
  <view class="container">

    <!-- 商品列表 -->
    <view class="prod-item">

      <block v-if="prodList.length">

        <block v-for="(prod, key) in prodList"
               :key="key"
        >
          <!--商品对象-->
          <view :data-prodid="prod.prodId"
                class="prod-items"
                @tap="toProdPage"
          >
            <!--图片 -->
            <view class="hot-imagecont">
              <image
                :src="prod.pic"
                class="hotsaleimg"
              />
            </view>

            <!--名称+描述-->
            <view class="hot-text">
              <view class="hotprod-text">
                {{ prod.prodName }}
              </view>
              <view class="prod-info">
                {{ prod.brief }}
              </view>
            </view>
          </view>
        </block>
      </block>

      <view
        v-else
        class="empty-wrap"
      >
        暂无商品数据
      </view>
    </view>
  </view>
</template>


<script setup>
const parentId = ref('') //todo merge
const categoryId = ref(0)
const current = ref(1) //页码
const prodList = ref([])


//? trigger

onLoad((options) => { //可以获取到上个页面传递过来的参数
  parentId.value = options.parentId
  categoryId.value = options.categoryId
  getProdList()
})


/**
 * 页面上拉触底事件 - 修改current来继续分页
 */
onReachBottom(() => {
  current.value = current.value + 1
  getProdList()
})


//? 加载项目

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
    })
}


//? 页面跳转

/**
 * 跳转商品详情
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
