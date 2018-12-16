module.exports = {
  //端口
  port: 8088,
  //数据库
  mysql_host: '',
  mysql_port: ,
  mysql_user: '',
  mysql_pass: '',
  mysql_db: 'huaxiaziben',
  //超级管理员
  root: '',
  pass: '870e0fb560ac33d462b2789c447d4259',
  //列表显示内容
  show_in_article_list: 'ID: ID, title: 标题, description: 描述, article: 文章, date: 日期',
  //新建时入库项
  insert_fields_article_list: 'ID,admin_ID,title,description,date,img_path,img_real_path,article',
  //不允许更改项
  disable_modify_field: 'ID,admin_ID,create_time'
}
