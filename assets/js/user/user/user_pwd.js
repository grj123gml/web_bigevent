$(function () {
  const form = layui.form;
  form.verify({
    pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
    samePwd: (value) => {
      if (value === $("[name=oldPwd]").val()) return "原密码和新密码不能相同";
    },
    rePwd: (value) => {
      if (value !== $("[name=newPwd]").val()) return "两次密码不一致";
    },
  });

  //更新密码
  $(".layui-form").submit(function (e) {
    e.preventDefault();
    $.ajax({
      type: "POST",
      url: "/my/updatepwd",
      data: $(this).serialize(),
      success: (res) => {
        if (res.status !== 0) return layer.msg(res.message);
        layer.msg("更新密码成功");
        //强制清空本地token
        localStorage.removeItem("token");
        //跳转至登录页面
        window.parent.location.href = "/login.html";
      },
    });
  });
});
