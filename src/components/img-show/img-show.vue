<template>
  <image
    v-if="!isError && imgPath"
    :class="classList"
    :mode="imgMode"
    :src="imgPath"
    :style="imgStyle"
    @error="imgError"
    @load="imgLoad"
    @tap="handleTap"
  />
  <image
    v-else
    :class="classList"
    :src="defaultImgPath"
    :style="imgStyle"
    @tap="handleTap"
  />
</template>

<script setup>

const emit = defineEmits(['imgError', 'imgLoad', 'handleTap'])
const isError = ref(false)

/**
 * 图片路径
 */
const props = defineProps({
  src: {
    type: String,
    default: ''
  },
  imgMode: {
    type: String,
    default: 'scaleToFill'
  },
  classList: {
    type: Array,
    default: () => {
      return []
    }
  },
  imgStyle: {
    type: Object,
    default: () => {
      return {}
    }
  },
  // 默认失败图片类型, false为默认图片, true为默认头像图片
  defaultImgType: {
    type: Boolean,
    default: false
  }
})

const imgPath = computed(() => {
  return util.checkFileUrl(props.src)
})

const defaultImgPath = computed(() => {
  if (props.defaultImgType) return '/static/images/icon/head04.png'
  return '/static/images/icon/def.png'
})


const imgError = () => {
  isError.value = true
  emit('imgError')
}

const imgLoad = (e) => {
  emit('imgLoad', e)
}

const handleTap = () => {
  emit('handleTap')
}
</script>


<style scoped>
image {
  width: 100%;
  height: 100%;
}
</style>
