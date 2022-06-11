$(function () {
  $("#link_reg").click(function () {
    $(".login-box").hide();
    $(".reg-box").show();
  });
  $("#link_login").click(function () {
    $(".login-box").show();
    $(".reg-box").hide();
  });

  // 从 LayUI 中获取 form 对象
  const form = layui.form;
  // 通过 form.verify() 方法自定义校验规则
  form.verify({
    // 自定义一个叫 pwd 的校验规则,数组方式
    pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
    // 校验两次密码是否一致的规则，函数方式
    repwd: (val) => {
      // 通过形参拿到的是确认密码框中的内容
      // 还需要拿到密码框中的内容
      // 然后进行一次等于的判断
      // 如果判断失败,则return一个提示消息即可
      const pwd = $(".reg-box [name=password]").val();
      // console.log(pwd, val);
      if (pwd !== val) return "两次密码不一致";
    },
  });

  // const baseUrl = "http://www.liulongbin.top:3007";
  $("#form_reg").submit((e) => {
    e.preventDefault();
    $.ajax({
      type: "POST",
      url: "/api/reguser",
      data: {
        username: $("#form_reg [name=username]").val(),
        password: $("#form_reg [name=password]").val(),
      },
      success: (res) => {
        console.log(res);
        if (res.status !== 0) return layer.msg(res.message);
        layer.msg("注册成功");
        //模拟点击事件
        $("#link_login").click();
      },
    });
  });
  $("#form_login").submit(function (e) {
    e.preventDefault();
    // console.log($(this).serialize());
    $.ajax({
      type: "POST",
      url: "/api/login",
      data: $(this).serialize(),
      success: (res) => {
        if (res.status !== 0) return layer.msg(res.message);
        layer.msg("登录成功！");
        // 将登录成功得到的 token 字符串，保存到 localStorage 中
        localStorage.setItem("token", res.token);
        // 跳转到主页
        location.href = "/index.html";
      },
    });
  });
});
