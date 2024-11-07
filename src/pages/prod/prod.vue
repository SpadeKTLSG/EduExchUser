<template>
  <!-- 商品详情 -->
  <view class="container">

    <!-- 主信息卡 -->
    <view class="prod-info">
      <!--名称-->
      <view class="prod-tit">
        {{ prodName }}
      </view>

      <!-- 简介 -->
      <view class="sales-p">
        简介: {{ brief }}
      </view>

      <!-- 主信息卡 -->
      <view class="prod-price">
        <text
          v-if="defaultSku && defaultSku.price"
          class="price"
        >
          预计价格 ￥
          <text class="price-num">
            {{ wxs.parsePrice(defaultSku.price)[0] }}
          </text>
          .{{ wxs.parsePrice(defaultSku.price)[1] }}
        </text>
        <text
          v-if="defaultSku && defaultSku.oriPrice"
          class="ori-price"
        >
          ￥{{ wxs.parsePrice(defaultSku.oriPrice)[0] }}.{{ wxs.parsePrice(defaultSku.oriPrice)[1] }}
        </text>
        <text class="sales"/>
      </view>
    </view>


    <!-- 商品详情 -->
    <view class="prod-detail">
      <view>
        <rich-text :nodes="content"/>
      </view>
    </view>


    <!-- 底部按钮 -->
    <view class="cart-footer">
      <view
        class="btn cart"
        @tap="addOrCannelCollection"
      >
        <text>收藏</text>
      </view>
      <view
        class="btn buy"
        @tap="toOrderPage"
      >
        <text>立即沟通</text>
      </view>
    </view>
    <!-- end 底部按钮 -->


  </view>
</template>

<script setup>
//note: 之后那个价格直接用int就行, 后端实现是这样的
const wxs = number()
let shopId = 1 //todo 获取店铺id
let prodId = 0
const skuList = ref([])
const brief = ref('')
const prodNum = ref(1)
const pic = ref('')
const imgs = ref('')
const prodName = ref('')
const price = ref(0)
const content = ref('')
let selectedPropObjList = null
const skuGroup = ref({})
const defaultSku = ref(null)
const selectedPropObj = ref({})
const propKeys = ref([])
const allProperties = ref([])
const findSku = ref(true)
const skuGroupList = ref([])


//? trigger

/**
 * 生命周期函数--监听页面加载
 */
onLoad((options) => { //options是页面跳转带来的参数
  prodId = options.prodid
  getProdInfo() // 加载商品数据
  getCollection()  // 查看用户是否收藏
})


//? 操作


/**
 * 组装SKU todo 全无用
 */
const groupSkuProp = (skuList, defaultPrice) => {
  if (skuList.length === 1 && !skuList[0].properties) {
    defaultSku.value = skuList[0]
    findSku.value = true
    return
  }
  const _skuGroupList = []
  const skuGroupParam = {}
  const _allProperties = []
  const _propKeys = []
  const _selectedPropObj = {}
  const selectedPropObjListParam = []

  let defaultSkuParam = null

  for (let i = 0; i < skuList.length; i++) {
    let isDefault = false
    if (!defaultSkuParam && skuList[i].price === defaultPrice) {
      defaultSkuParam = skuList[i]
      isDefault = true
    }
    const properties = skuList[i].properties // 版本:公开版;颜色:金色;内存:64GB
    _allProperties.push(properties)
    const propList = properties.split(';') // ["版本:公开版","颜色:金色","内存:64GB"]
    for (let j = 0; j < propList.length; j++) {
      const propval = propList[j].split(':') // ["版本","公开版"]
      let props = skuGroupParam[propval[0]] // 先取出 版本对应的值数组
      // 如果当前是默认选中的sku，把对应的属性值 组装到selectedProp
      if (isDefault) {
        _propKeys.push(propval[0])
        _selectedPropObj[propval[0]] = propval[1]
        const selectedPropObjItem = {}
        selectedPropObjItem[propval[0]] = propval[1]
        selectedPropObjListParam.push(selectedPropObjItem)
      }
      if (!props) {
        props = [] // 假设还没有版本，新建个新的空数组
        props.push(propval[1]) // 把 "公开版" 放进空数组
      } else {
        if (props.indexOf(propval[1]) === -1) { // 如果数组里面没有"公开版"
          props.push(propval[1]) // 把 "公开版" 放进数组
        }
      }
      skuGroupParam[propval[0]] = props // 最后把数据 放回版本对应的值
      const propListItem = {}
      propListItem[propval[0]] = props
      _skuGroupList.push(propListItem)
    }
  }

  defaultSku.value = defaultSkuParam
  propKeys.value = _propKeys
  selectedPropObj.value = _selectedPropObj
  skuGroup.value = skuGroupParam
  selectedPropObjList = selectedPropObjListParam

  skuGroupList.value = (_skuGroupList) => {
    const map = {}
    _skuGroupList.forEach(item => {
      const obj = {}
      Object.keys(item).sort().map(key => (obj[key] = item[key]))
      map[JSON.stringify(obj)] = item
    })
    return Object.keys(map).map(key => JSON.parse(key))
  }
  allProperties.value = _allProperties
  parseSelectedObjToVals(skuList)
}
const selectedPropList = ref(null)
/**
 * 将已选的 {key:val,key2:val2}转换成 [val,val2]
 */
const parseSelectedObjToVals = (skuList) => {
  const selectedPropObjListParam = selectedPropObjList
  let selectedPropertiesParam = ''
  const selectedPropListParam = []
  const selectedPropShowListParam = []
  for (let i = 0; i < selectedPropObjListParam.length; i++) {
    const selectedPropObjItem = selectedPropObjListParam[i]
    for (const key in selectedPropObjItem) {
      if (Object.hasOwnProperty.call(selectedPropObjItem, key)) {
        selectedPropListParam.push(key + ':' + selectedPropObjItem[key])
        selectedPropShowListParam.push(selectedPropObjItem[key])
        selectedPropertiesParam += key + ':' + selectedPropObjItem[key] + ';'
      }
    }
  }
  selectedPropertiesParam = selectedPropertiesParam.substring(0, selectedPropertiesParam.length - 1)
  selectedPropList.value = selectedPropListParam
  selectedPropObjList = selectedPropObjListParam
  let findSkuParam = false
  for (let i = 0; i < skuList.length; i++) {
    if (skuList[i].properties === selectedPropertiesParam) {
      findSkuParam = true
      defaultSku.value = skuList[i]
      break
    }
  }
  findSku.value = findSkuParam
}


/**
 * 添加或者取消收藏
 */
const addOrCannelCollection = () => {
  uni.showLoading()
  http.request({
    url: '/p/user/collection/addOrCancel',
    method: 'POST',
    data: prodId
  })
    .then(() => {
      isCollection.value = !isCollection.value
      uni.hideLoading()
    })
}

//? 页面跳转

/**
 * 跳转购买页面
 */
const toOrderPage = () => {
  //页面跳转的传递参数: 保存本地
  uni.setStorageSync('orderItem', JSON.stringify({
    prodId,
    skuId: defaultSku.value.skuId,
    prodCount: prodNum.value,
    shopId
  }))
  uni.navigateTo({
    url: '/pages/submit-order/submit-order?orderEntry=1'
  })
}


//? 加载项目


/**
 * 获取是否收藏信息
 */
const getCollection = () => {
  http.request({
    url: '/p/user/collection/isCollection',
    method: 'GET',
    data: {
      prodId
    }
  })
    .then(({data}) => {
      isCollection.value = data
    })
}

/**
 * 获取商品信息
 */
const getProdInfo = () => { //传参要使用LocateVO传递
  http.request({
    url: '/prod/prodInfo',
    method: 'GET',
    data: {
      prodId
    }
  })
    .then(({data}) => {
      imgs.value = data.imgs?.split(',')
      content.value = util.formatHtml(data.content)
      price.value = data.price
      prodName.value = data.prodName
      prodId = data.prodId
      brief.value = data.brief
      skuList.value = data.skuList
      pic.value = data.pic
      // 组装sku
      groupSkuProp(data.skuList, data.price)
    })
}


</script>

<style lang="scss" scoped>
@use './prod.scss';
</style>
