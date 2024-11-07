const util = {
  /**
   * 文件地址校验
   * @param fileUrl 获取到的文件路径
   */
  checkFileUrl: (fileUrl) => {
    // 防止 fileUrl 为null时 indexOf() 方法失效报错
    const url = fileUrl || ''
    const baseUrl = import.meta.env.VITE_APP_RESOURCES_URL

    // 判断 fileUrl 中是否已存在基础路径
    const check = url.indexOf(baseUrl) !== -1
    if (check || !fileUrl) {
      return url
    } else {
      return baseUrl + url
    }
  }
}

export default util
