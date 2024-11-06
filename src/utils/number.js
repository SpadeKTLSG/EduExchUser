// 原  wxs/number.wxs 文件，使用时在 js中引入
// const wxs = number()

function number() {
  let wxs;
  wxs = {
    // 转换为价格的格式
    toPrice: (val) => {
      if (!val) {
        val = 0
      }
      val = Number(val)
      return val.toFixed(2)
    },
    // 价格展示
    parsePrice: (val) => {
      if (!val) {
        val = 0
      }
      return val.toFixed(2).split('.')
    },

    // 取整
    rounding: (val) => {
      if (!val) {
        val = 0
      }
      return parseInt(val)
    },

    // 满减格式
    parseDiscount: (discountRule, lang) => {
      if (discountRule === 0) {
        return lang === 'zh_CN' ? '满额减' : 'Amount'
      } else if (discountRule === 1) {
        return lang === 'zh_CN' ? '满件减' : 'Pieces'
      } else if (discountRule === 2) {
        return lang === 'zh_CN' ? '满额折' : 'Amount-discount'
      } else if (discountRule === 3) {
        return lang === 'zh_CN' ? '满件折' : 'Pieces-discount'
      } else {
        return ''
      }
    },

    // 满减提示
    parseDiscountMsg: (discountRule, needAmount, discount, lang) => {
      if (discountRule === 0) {
        return lang === 'zh_CN' ? '购满' + needAmount + '元减' + discount + '元' : 'Over ' + needAmount + ' minus ' + discount
      } else if (discountRule === 1) {
        return lang === 'zh_CN' ? '购满' + needAmount + '件减' + discount + '元' : discount + ' less for ' + needAmount + ' pieces'
      } else if (discountRule === 2) {
        return lang === 'zh_CN' ? '购满' + needAmount + '元打' + discount + '折' : discount + '% off over ' + needAmount
      } else if (discountRule === 3) {
        return lang === 'zh_CN' ? '购满' + needAmount + '件打' + discount + '折' : discount + '% off over ' + needAmount + ' pieces'
      } else {
        return ''
      }
    }
  };

  return wxs
}

export default number
