const express = require('express');
const url = require('url');

let router = express.Router();

module.exports = router;

router.get('/', (req, res)=>{
  res.render('fe_index');
});

router.get('/news', (req, res)=>{
  const size = 3;
  let {page} = req.query;

  page = parseInt(page);

  if (isNaN(page)||page<1) {
    page = 1;
  }

  let start = (page - 1) * size;
  req.db.query(`SELECT ID,title,description,date,img_path FROM article_list_table ORDER BY create_time DESC LIMIT ${start},${size}`, (err, result)=>{
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      req.db.query(`SELECT COUNT(*) AS c FROM article_list_table`, (err, data)=>{
        if (err) {
          res.sendStatus(500);
        } else if (data.length==0) {
          res.sendStatus(404);
        } else {
          result.forEach(t=>{
            let oDate = new Date(t['date']*1000);
            t['date'] = oDate.getFullYear() + '年' + (oDate.getMonth() + 1) + '月' + oDate.getDate() + '日';
          });

          res.render('news', {
            data: result,
            page_count: Math.ceil(data[0].c/size),
            page
          });
        }
      });
    }
  });
});

router.get('/nav', (req, res)=>{
  res.render('nav');
});

router.get('/about', (req, res)=>{
  res.render('about');
});

router.get('/article/:id', (req, res)=>{
  let {id} = req.params;

  req.db.query(`SELECT title,article FROM article_list_table WHERE ID='${id}'`, (err, data)=>{
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else if (data.length==0) {
      res.sendStatus(404);
    } else {
      res.render('article', {data});
    }
  });
});

router.get('/contact', (req, res)=>{
  res.render('contact');
});

router.get('/product', (req, res)=>{
  res.render('product');
});
