function number() {
  let wxs;

  wxs = {
    // 价格展示
    parsePrice: (val) => {
      if (!val) {
        val = 0
      }
      return val.toFixed(2).split('.')
    }
  };

  return wxs
}

export default number
