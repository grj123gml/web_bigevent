$(function () {
  const form = layui.form;
  const laypage = layui.laypage;
  // 定义一个查询的参数对象，将来请求数据的时候，
  // 需要将请求参数对象提交到服务器
  const q = {
    pagenum: 1, // 页码值，默认请求第一页的数据
    pagesize: 2, // 每页显示几条数据，默认每页显示5条
    cate_id: "", // 文章分类的 Id
    state: "", // 文章的发布状态
  };
  // 获取文章列表数据
  const initTable = () => {
    $.ajax({
      type: "GET",
      url: "/my/article/list",
      data: q,
      success: (res) => {
        if (res.status !== 0) return layer.msg("获取文章列表失败！");
        // 使用模板引擎渲染页面的数据
        const htmlStr = template("tpl-table", res);
        $("tbody").html(htmlStr);
        //渲染分页
        renderPage(res.total);
      },
    });
  };

  //   初始化文章分类数据
  const initCate = () => {
    $.ajax({
      type: "GET",
      url: "/my/article/cates",
      success: (res) => {
        if (res.status !== 0) return layer.msg("获取分类数据失败！");
        const htmlStr = template("tpl-cate", res);
        // 调用模板引擎渲染分类的可选项
        $("[name=cate_id]").html(htmlStr);
        // 通过 layui 重新渲染表单区域的UI结构
        form.render();
      },
    });
  };

  //   筛选功能
  $("#form-search").on("submit", function (e) {
    e.preventDefault();
    // 获取表单中选中项的值,为查询参数对象 q 中对应的属性赋值
    q.cate_id = $("[name=cate_id]").val();
    q.state = $("[name=state]").val();
    initTable();
  });

  //渲染分页函数
  const renderPage = (total) => {
    // console.log(total);
    // 调用 laypage.render() 方法来渲染分页的结构
    laypage.render({
      elem: "pageBox", // 分页容器的 Id
      count: total, // 总数据条数
      limit: q.pagesize, // 每页显示几条数据
      curr: q.pagenum, // 当前页码
      layout: ["count", "limit", "prev", "page", "next", "skip"],
      limits: [2, 3, 5, 10],
      // 分页发生切换的时候，触发 jump 回调
      jump: function (obj, first) {
        // console.log(obj);
        // console.log(obj.curr);
        // console.log(first);
        // 把最新的页码值，赋值到 q 这个查询参数对象中
        q.pagenum = obj.curr;
        // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
        q.pagesize = obj.limit;
        if (!first) {
          initTable();
        }
      },
    });
  };

  //通过事件委托删除文章
  $("tbody").on("click", ".btn-delete", function () {
    const btnNum = $(".btn-delete").length;
    const id = $(this).attr("data-id");
    // 询问用户是否要删除数据
    layer.confirm("确认删除?", { icon: 3, title: "提示" }, function (index) {
      $.ajax({
        method: "GET",
        url: "/my/article/delete/" + id,
        success: function (res) {
          if (res.status !== 0) return layer.msg("删除文章失败！");
          if (btnNum === 1) {
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
          }
          initTable();
          layer.close(index);
        },
      });
    });
  });

  initTable();
  initCate();

  // 定义美化时间的过滤器
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date);

    var y = dt.getFullYear();
    var m = padZero(dt.getMonth() + 1);
    var d = padZero(dt.getDate());

    var hh = padZero(dt.getHours());
    var mm = padZero(dt.getMinutes());
    var ss = padZero(dt.getSeconds());

    return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
  };

  // 定义补零的函数
  function padZero(n) {
    return n > 9 ? n : "0" + n;
  }
});
