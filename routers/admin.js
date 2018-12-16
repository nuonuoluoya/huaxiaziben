const express = require('express');
const config = require('../config');
const common = require('../libs/common');
const fs = require('fs');

let router = express.Router();

module.exports = router;

router.use((req, res, next)=>{
  if (!req.cookies['admin_token']&&req.path!='/login') {
    res.redirect(`/admin/login?ref=${req.url}`);
  } else {
    if (req.path=='/login') {
      next();
    } else {
      req.db.query(`SELECT * FROM admin_token_table WHERE ID='${req.cookies['admin_token']}'`, (err, data)=>{
        if (err) {
          res.sendStatus(500);
        } else if (data[0].length==0) {
          res.redirect('/admin/login');
        } else {
          req.admin_ID = data[0]['admin_ID'];
          next();
        }
      });
    }
  }
});

router.get('/login', (req, res)=>{
  res.render('login', {err_msg: '', ref: req.query['ref']||''});
});

router.post('/login', (req, res)=>{
  let {username, password} = req.body;

  function showErr(msg) {
    res.render('login', {err_msg: msg, ref: req.query['ref']||''});
  }

  function setToken(id) {
    let ID = common.uuid();
    let oDate = new Date();
    oDate.setMinutes(oDate.getMinutes() + 20);
    let t = Math.floor(oDate.getTime() / 1000);
    req.db.query(`INSERT INTO admin_token_table (ID, admin_ID, expires) VALUES('${ID}', '${id}', ${t})`, err=>{
      if (err) {
        res.sendStatus(500);
      } else {
        res.cookie('admin_token', ID);

        let ref = req.query['ref'];
        if (!ref) {
          ref = '';
        }
        res.redirect('/admin' + ref);
      }
    });
  }

  if (username==config.root) {
    if (common.md5(password)==config.pass) {
      console.log('login success!');
      setToken(1);
    } else {
      showErr('用户名或密码有误');
    }
  } else {
    req.db.query(`SELECT * FROM admin_table WHERE username='${username}'`, (err, data)=>{
      if (err) {
        showErr('数据库错误');
        console.log(err);
      } else if (data.length==0) {
        showErr('用户名或密码有误');
      } else {
        if (data[0].password==common.md5(password)) {
          setToken(data[0].ID);
          console.log('login success!');
        } else {
          showErr('用户名或密码有误');
        }
      }
    });
  }
});

router.get('/', (req, res)=>{
  res.redirect('/admin/article_list');
});

router.get('/:table', (req, res)=>{
  const {table} = req.params;
  if (!config[`show_in_${table}`]) {
    res.sendStatus(404);
  } else {
    let aField = [];
    let jsonShowName = {};
    config[`show_in_${table}`].replace(/\s+/g, '').split(',').forEach(str=>{
      let [field, showName] = str.split(':');
      aField.push(field);
      jsonShowName[field] = showName;
    });

    const size = 10;
    let page = req.query.page;

    let like_seg = '1=1';
    if (req.query.keyword) {
      let keys = req.query.keyword.split(/\s+/g);
      like_seg = keys.map(item=>`title Like '%${item}%'`).join(' OR ');
    }

    if (!page) {
      page = 1;
    } else if (!/^[1-9]\d*$/.test(page)) {
      page = 1;
    }
    let start = (page - 1) * size;

    req.db.query(`SELECT ${aField.join(',')} FROM ${table}_table WHERE ${like_seg} ORDER BY create_time DESC LIMIT ${start},${size}` ,(err, result)=>{
      if (err) {
        res.sendStatus(500);
      } else {
        req.db.query(`SELECT COUNT(*) AS c FROM ${table}_table WHERE ${like_seg}`, (err, data)=>{
          if (err) {
            res.sendStatus(500);
          } else if (data.length==0) {
            res.sendStatus(500);
          } else {
            res.render('index', {
              data: result,
              cur_page: parseInt(page),
              show_page_count: 9,
              page_count: Math.ceil(data[0].c/size),
              keyword: req.query.keyword,
              jsonShowName,
              table
            })
          }
        });
      }
    });
  }
});

router.post('/:table', (req, res)=>{
  const file_info = {
    'image': {
      path: 'img_path',
      real_path: 'img_real_path'
    }
  }

  if (typeof req.files[0]!='undefined') {
    req.body[file_info[req.files[0].fieldname].path] = req.files[0].filename;
    req.body[file_info[req.files[0].fieldname].real_path] = req.files[0].path.replace(/\\/, '\\\\');
  }

  const {table} = req.params;

  if (req.body['is_mod']=='true') {
    if (!config[`insert_fields_${table}`]) {
      res.sendStatus(404);
    } else {
      let fields = config[`insert_fields_${table}`].split(',');
      config[`disable_modify_field`].split(',').forEach(name=>{
        fields = fields.filter(item=>item!=name);
      });

      let arr = [];

      fields.forEach(key=>{
        if (typeof req.body[key]=='undefined') {
          req.body[key] = '';
        } else if (req.body['date']=='') {
          req.body['date'] = 0;
        }
        arr.push(`${key}='${req.body[key]}'`);
      });

      let sql = `UPDATE ${table}_table SET ${arr.join(',')} WHERE ID='${req.body['old_id']}'`;
      req.db.query(sql, err=>{
        if (err) {
          console.log(err);
          res.sendStatus(500);
        } else {
          res.redirect(`/admin/${table}`);
        }
      });
    }
  } else {
    req.body['ID'] = common.uuid();
    req.body['admin_ID'] = req.admin_ID;

    let arrField = [], arrValue = [];

    config[`insert_fields_${table}`].split(',').forEach(name=>{
      arrField.push(name);
      arrValue.push(req.body[name]);
    });

    arrField.push('create_time');
    arrValue.push(Math.floor(new Date().getTime()/1000));

    let sql = `INSERT INTO ${table}_table (${arrField.join(',')}) VALUES('${arrValue.join("','")}')`;

    req.db.query(sql, err=>{
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } else {
        res.redirect(`/admin/${table}`);
      }
    });
  }
});

router.get('/:table/delete', (req, res)=>{
  const {table} = req.params;
  let ID = req.query['id'];
  let aID = ID.split(',');
  let b_err = false;
  aID.forEach(item=>{
    if (!/^(\d|[a-f]){32}$/.test(item)) {
      b_err = true;
    }
  });

  if (b_err) {
    res.sendStatus(404);
  } else {
    let id_index = 0;

    _next();
    function _next() {
      let ID = aID[id_index++];

      function deleteFromDb() {
        req.db.query(`DELETE FROM ${table}_table WHERE ID='${ID}'`, err=>{
          if (err) {
            console.log('数据库错误');
            res.sendStatus(500);
          } else {
            if (id_index<aID.length) {
              _next();
            } else {
              res.redirect(`/admin/${table}`);
            }
          }
        });
      }

      req.db.query(`SELECT * FROM ${table}_table WHERE ID='${ID}'`, (err, data)=>{
        if (err) {
          console.log(err);
          res.sendStatus(500);
        } else if (data.length==0) {
          res.sendStatus(404, 'no data');
        } else {
          if (data[0]['img_real_path']&&data[0]['img_path']) {
            fs.unlink(data[0]['img_real_path'], err=>{
              if (err) {
                res.sendStatus(500);
              } else {
                deleteFromDb();
              }
            });
          } else {
            deleteFromDb();
          }
        }
      });
    }
  }
});

router.get('/:table/get_data', (req, res)=>{
  const {table} = req.params;
  const id = req.query.id;
  if (!id) {
    res.sendStatus(404);
  } else if (!/^[\da-f]{32}$/.test(id)) {
    res.sendStatus(400);
  } else {
    req.db.query(`SELECT * FROM ${table}_table WHERE ID='${id}'`, (err, data)=>{
      if (err) {
        res.sendStatus(500);
      } else if (data.length==0) {
        res.sendStatus(404);
      } else {
        res.send(data[0]);
      }
    });
  }
});
