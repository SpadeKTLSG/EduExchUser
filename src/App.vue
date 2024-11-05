<script setup>
http.getCartCount()
</script>

<style lang="scss" scoped>
@import "./styles/app.css";
/* 隐藏头部 */
uni-page-head {
  display: none;
}

/* 轮播图指示点 */
uni-swiper . uni-swiper-dots-horizontal {
  bottom: 20px !important;
}
</style>
