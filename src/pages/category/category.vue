<template>
  <!--下方第二个页面 - 分类-->
  <view class="container">

    <view class="main">

      <!--左侧菜单-->
      <scroll-view class="leftmenu"
                   scroll-y="true"
      >
        <block v-for="(item, index) in categoryList"
               :key="index"
        >
          <view
            :class="'menu-item ' + (selIndex === index? 'active':'') + ' '"
            :data-id="item.categoryId"
            :data-index="index"
            @tap="onMenuTab"
          >
            {{ item.categoryName }}
          </view>
        </block>

      </scroll-view>


      <!-- 右半边 - 对应商品分页拉取 TODO -->
      <scroll-view class="rightcontent"
                   scroll-y="true"
      >

        <!-- 子分类文字 -->
        <!--        TODO: 删除-->
        <view v-if="subCategoryList.length"
              class="th-cate-con"
        >

          <block
            v-for="(thCateItem, index) in subCategoryList"
            :key="index"
          >
            <view class="sub-category">
              <view
                :data-categoryid="thCateItem.categoryId"
                :data-parentid="thCateItem.parentId"
                class="sub-category-item"
                @tap="toCatePage"
              >
                <image
                  :src="util.checkFileUrl(thCateItem.pic)"
                  class="more-pic"
                  mode="widthFix"
                />
                <text>{{ thCateItem.categoryName }}</text>
              </view>
            </view>
          </block>

        </view>
        <view v-else
              class="cont-item empty"
        >
          等待转移
        </view>


      </scroll-view>
    </view>
  </view>
</template>

<script setup>
import util from '@/utils/util.js'

const categoryList = ref([]) // 分类列表
const parentId = ref('') // 父分类id
const selIndex = ref(0) // 选中的分类索引
const subCategoryList = ref([]) //todo删除

//? trigger

onLoad(() => {

  http.request({// 加载分类列表(全拉取)
    url: '/category/categoryInfo',
    method: 'GET',
    data: {
      parentId: ''
    }
  })
    .then(({data}) => {
      categoryList.value = data
      getProdList(data[0].categoryId)
      parentId.value = categoryList.value[0].categoryId
    })
})


//? 操作

/**
 * 点击左侧分类列表事件处理
 */
const onMenuTab = (e) => {
  const index = e.currentTarget.dataset.index // 索引
  getProdList(categoryList.value[index].categoryId) //
  parentId.value = categoryList.value[index].categoryId
  selIndex.value = index
}

//? 加载项目

/**
 * 加载分类列表
 * @param categoryId
 */
const getProdList = (categoryId) => {
  http.request({
    url: '/category/categoryInfo',
    method: 'GET',
    data: {
      parentId: categoryId
    }
  })
    .then(({data}) => {
      subCategoryList.value = data
    })
}

//? 页面跳转

/**
 * 跳转子分类商品页面
 * ! note: 这里的逻辑与我的后端还是有重大问题, 只能有一级分类, 一级分类下面就是对应的展示页面. 之后需要把子页面嫁接到这里
 */
const toCatePage = (e) => {
  const {categoryid} = e.currentTarget.dataset
  uni.navigateTo({
    url: `/pages/sub-category/sub-category?parentId=${parentId.value}&categoryId=${categoryid}`
  })
}

</script>

<style lang="scss" scoped>
@use "./category.scss";
</style>
