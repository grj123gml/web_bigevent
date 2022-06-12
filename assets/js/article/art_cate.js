$(function () {
  const form = layui.form;
  //获取文章内容 并渲染
  const initArtCateList = () => {
    $.ajax({
      type: "GET",
      url: "/my/article/cates",
      success: (res) => {
        if (res.status !== 0) return layer.msg(res.message);
        console.log(res);
        // 调用模板引擎
        const htmlStr = template("tpl-table", res);
        $("tbody").empty().html(htmlStr);
      },
    });
  };

  let indexAdd = null;
  //给添加类别按钮添加绑定事件
  const layer = layui.layer;
  $("#btnAddCate").click(function () {
    indexAdd = layer.open({
      type: 1,
      area: ["500px", "250px"],
      title: "添加文章分类",
      content: $("#dialog-add").html(),
    });
  });
  //实现添加文章分类的功能
  $("body").on("submit", "#form-add", function (e) {
    e.preventDefault();
    $.ajax({
      type: "POST",
      url: "/my/article/addcates",
      data: $(this).serialize(),
      success: (res) => {
        if (res.status !== 0) return layer.msg(res.message);
        //重新渲染数据列表
        initArtCateList();
        //关闭弹窗
        layer.close(indexAdd);
      },
    });
  });

  // 通过代理方式，为 btn-edit 按钮绑定点击事件
  let indexEdit = null;
  $("tbody").on("click", ".btn-edit", function () {
    const id = $(this).attr("data-id");
    // 弹出修改文章分类的弹窗
    indexEdit = layer.open({
      type: 1,
      area: ["500px", "250px"],
      title: "修改文章分类",
      content: $("#dialog-edit").html(),
    });
    $.ajax({
      type: "GET",
      url: "/my/article/cates/" + id,
      success: (res) => {
        if (res.status !== 0) return layer.msg(res.message);
        form.val("form-edit", res.data);
      },
    });
  });

  //修改文章分类
  $("body").on("submit", "#form-edit", function (e) {
    e.preventDefault();
    $.ajax({
      type: "POST",
      url: "/my/article/updatecate",
      data: $(this).serialize(),
      success: (res) => {
        if (res.status !== 0) return layer.msg(res.message);
        initArtCateList();
        layer.close(indexEdit);
      },
    });
  });

  //删除文章分类// 删除文章分类
  $("tbody").on("click", ".btn-delete", function () {
    const id = $(this).attr("data-id");
    // 提示用户是否删除
    layer.confirm("确定删除吗？", { icon: 3, title: "提示" }, function (index) {
      $.ajax({
        method: "GET",
        url: "/my/article/deletecate/" + id,
        success: function (res) {
          if (res.status !== 0) return layer.msg(res.message);
          layer.close(index);
          initArtCateList();
        },
      });
    });
  });

  initArtCateList();
});
