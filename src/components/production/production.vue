<template>

  <view
    :data-prodid="item.prodId"
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
      <view
        v-if="sts===6"
        class="prod-info"
      >
        {{ item.prodCommNumber }}评价 {{ item.positiveRating }}%好评
      </view>
      <view class="prod-text-info">
        <view class="price">
          <text
            v-if="sts===2"
            class="deadline-price"
          >
            限时价
          </text>
          <text class="symbol">
            ￥
          </text>
          <text class="big-num">
            {{ wxs.parsePrice(item.price)[0] }}
          </text>
          <text class="small-num">
            .{{ wxs.parsePrice(item.price)[1] }}
          </text>
        </view>
      </view>
    </view>
  </view>
</template>


<script setup>
const wxs = number()
const props = defineProps({
  item: {
    type: Object,
    default: () => {
      return null
    }
  },
  sts: {
    type: Number,
    default: () => {
      return 2
    }
  }
})


const toProdPage = (e) => {
  const prodid = e.currentTarget.dataset.prodid
  uni.navigateTo({
    url: '/pages/prod/prod?prodid=' + prodid
  })
}

</script>


<style lang="scss" scoped>
.prod-items {
  width: 43%;
  background: #fff;
  margin-bottom: 40rpx;
  box-sizing: border-box;

  .hot-imagecont {
    border-radius: 8rpx;
    text-align: center;
    font-size: 0;
  }

  .hot-text {
    margin-top: 20rpx;

    .prod-info {
      font-size: 20rpx;
      color: #777;
      padding: 0 20rpx;
      margin-top: 8rpx;
    }

    .prod-text-info {
      position: relative;
      height: 50rpx;
      line-height: 70rpx;
      font-family: Arial;

      .price {
        color: #eb2444;
        padding-left: 20rpx;
      }
    }
  }
}

prod {
  &:nth-child(2n-1) {
    .prod-items {
      padding: 20rpx 10rpx 10rpx 20rpx;
    }
  }

  &:nth-child(2n) {
    .prod-items {
      padding: 20rpx 20rpx 10rpx 10rpx;
    }
  }
}

.hot-imagecont {
  .hotsaleimg {
    width: 100%;
    height: 345rpx;
  }
}

.hot-text {
  .hotprod-text {
    height: 76rpx;
    font-size: 28rpx;
    display: -webkit-box;
    word-break: break-all;
    padding: 0 20rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    color: #000;
  }
}

.deadline-price {
  font-size: 22rpx;
  margin-right: 5rpx;
}

</style>
