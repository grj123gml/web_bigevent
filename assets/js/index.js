//获取用户基本信息
function getUserInfo() {
  $.ajax({
    method: "GET",
    url: "/my/userinfo",
    // headers: {
    //   Authorization: localStorage.getItem("token"),
    // },
    success: (res) => {
      if (res.status !== 0) return layer.msg(res.message);
      layer.msg("获取用户信息成功");
      // console.log(res);
      readerAvatar(res.data);
    },
    // complete: (res) => {
    //   console.log(res);
    //   if (
    //     res.responseJSON.status === 1 &&
    //     res.responseJSON.message === "身份认证失败！"
    //   ) {
    //     localStorage.removeItem("token");
    //     location.href = "/login.html";
    //   }
    // },
  });
}

//退出登录
$("#btnLogout").click(function () {
  layui.layer.confirm(
    "确定退出登录？",
    { icon: 3, title: "" },
    function (index) {
      // 清空本地存储里面的 token
      localStorage.removeItem("token");
      // 重新跳转到登录页面
      location.href = "/login.html";
    }
  );
});

//获取用户列表
getUserInfo();

const readerAvatar = (user) => {
  //渲染欢迎语
  const name = user.nickname || user.username;
  $("#welcome").html(`欢迎 ${name}`);
  //按需渲染头像
  if (user.user_pic !== null) {
    $(".layui-nav-img").attr("src", user.user_pic).show();
    $(".text-avatar").hide();
  } else {
    $(".layui-nav-img").hide();
    //用户名的首字母设置为大写渲染到文字框里
    let first = name[0].toUpperCase();
    $(".text-avatar").html(first).show();
  }
};

function change() {
  $("#change").addClass("layui-this").next().removeClass("layui-this");
}
