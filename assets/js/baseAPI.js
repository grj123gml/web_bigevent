// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter((options) => {
  // console.log(options);
  // 在发起真正的 Ajax 请求之前，统一拼接请求的根路径
  options.url = "http://big-event-api-t.itheima.net" + options.url;
  //includes()方法判断一个字符串是否存在于另一个字符串里，有就返回true，否则false
  // indexOf()方法判断一个字符串是否存在于另一个字符串里，有就返回下标，否则返回-1e
  if (options.url.includes("/my/")) {
    options.headers = {
      Authorization: localStorage.getItem("token"),
    };
  }
  //权限校验
  options.complete = (res) => {
    // console.log(res);
    if (
      res.responseJSON.status === 1 &&
      res.responseJSON.message === "身份认证失败！"
    ) {
      localStorage.removeItem("token");
      location.href = "/login.html";
    }
  };
});
