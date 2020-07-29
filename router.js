var express = require('express')
var Book = require('./models/book')
var User = require('./models/user')
var md5 = require('blueimp-md5')
    //tu
var multer = require('multer')
var fs = require('fs')

var router = express.Router()
    //(必须引入的模块)
var createFolder = function(folder) {
    try {
        fs.accessSync(folder);
    } catch (e) {
        fs.mkdirSync(folder);
    }
};

var uploadFolder = './upload/';

createFolder(uploadFolder);
//默认存在/tmp/my-uploads
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadFolder)
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)

    }

})

var upload = multer({ storage: storage })
router.get('/login', function(req, res) {
    res.render('login.html')
})

router.post('/login', function(req, res) {
    // 1. 获取表单数据
    // 2. 查询数据库用户名密码是否正确
    // 3. 发送响应数据

    var body = req.body


    User.findOne({
        nickname: body.nickname,
        password: md5(md5(body.password))
    }, function(err, user) {
        if (err) {
            return res.status(500).json({
                err_code: 500,
                message: err.message
            })
        }

        //如果邮箱和密码匹配，则 user 是查询到的用户对象，否则就是 null
        if (!user) {
            return res.status(200).json({
                err_code: 1,
                message: 'Email or password is invalid.'
            })
        }

        // 用户存在，登陆成功，通过 Session 记录登陆状态
        req.session.user = user

        res.status(200).json({
            err_code: 0,
            message: 'OK'
        })
    })
})
router.get('/register', function(req, res) {
    res.render('register.html')
})
router.post('/register', function(req, res) {
    // 1. 获取表单提交的数据
    //    req.body
    // 2. 操作数据库
    //    判断改用户是否存在
    //    如果已存在，不允许注册
    //    如果不存在，注册新建用户
    // 3. 发送响应re

    console.log(req.body);
    var body = req.body
    User.findOne({
            nickname: body.nickname
        },
        function(err, data) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: '服务端错误'
                })
            }
            // ////le.log(data)
            if (data) {
                return res.status(200).json({
                    err_code: 1,
                    message: 'nickname aleady exists.'
                })

            }

            // 对密码进行 md5 重复加密
            body.password = md5(md5(body.password))

            new User(body).save(function(err, user) {
                if (err) {
                    return res.status(500).json({
                        err_code: 500,
                        message: 'Internal error.'
                    })
                }

                // 注册成功，使用 Session 记录用户的登陆状态
                req.session.user = user

                // Express 提供了一个响应方法：json
                // 该方法接收一个对象作为参数，它会自动帮你把对象转为字符串再发送给浏览器
                res.status(200).json({
                    err_code: 0,
                    message: 'OK'
                })

                // 服务端重定向只针对同步请求才有效，异步请求无效
                // res.redirect('/')
            })
        })
})

router.get('/out', function(req, res) {
        // 清除登陆状态
        req.session.user = null

        // 重定向到登录页
        res.redirect('/items/Home')
    })
    //index.html

router.get('/Buy', function(req, res) {
        // 清除登陆状态


        // 重定向到登录页
        res.render("buy.html", {
            id: req.query.id
        })
    })
    //index.html

router.post('/Search', function(req, res) {
    // //le.log(req.body.name)
    Book.findOne({
            name: req.body.name
        },
        function(err, items) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: '服务端错误'
                })
            }
            //le.log(items)
            if (items == null) {

                return res.status(200).json({
                    err_code: 1,
                    message: '抱歉，暂时没有这本书'
                })

            } else {
                res.render("product.html", {
                    user: req.session.user,

                    Product: items
                })

            }

        })


})
router.get('/items/:item', function(req, res) {
        // ////le.log(req.params)

        //res.send(req.params.id)

        //console.log("1-1");
        //////le.log(req.params.item)

        if (req.params.item == "Home") {

            if (req.session.user == null || req.session.user.nickname != "master") {
                // console.log(req.session);
                var a = []
                var b = []
                var c = []
                var d = []
                var e = []
                var f = []
                var g = []
                Book.find({
                        btype: '文学'
                    },
                    function(err, items) {
                        if (err) {
                            return res.status(500).json({
                                err_code: 500,
                                message: err.message
                            })
                        }
                        g[0] = items[6]
                        for (i = 0; i < 5; i++) {
                            a[i] = items[i]
                        }
                        Book.find({
                                btype: '艺术'
                            },
                            function(err, items) {
                                if (err) {
                                    return res.status(500).json({
                                        err_code: 500,
                                        message: err.message
                                    })
                                }
                                g[1] = items[8]
                                for (i = 0; i < 5; i++) {
                                    b[i] = items[i]
                                }
                                Book.find({
                                        btype: '军事'
                                    },
                                    function(err, items) {
                                        if (err) {
                                            return res.status(500).json({
                                                err_code: 500,
                                                message: err.message
                                            })
                                        }
                                        g[2] = items[9]
                                        for (i = 0; i < 5; i++) {
                                            c[i] = items[i]
                                        }
                                        Book.find({
                                                btype: '小说'
                                            },
                                            function(err, items) {
                                                if (err) {
                                                    return res.status(500).json({
                                                        err_code: 500,
                                                        message: err.message
                                                    })
                                                }
                                                g[3] = items[7]
                                                for (i = 0; i < 5; i++) {
                                                    d[i] = items[i]
                                                }
                                                Book.find({
                                                        btype: '科幻'
                                                    },
                                                    function(err, items) {
                                                        if (err) {
                                                            return res.status(500).json({
                                                                err_code: 500,
                                                                message: err.message
                                                            })
                                                        }

                                                        for (i = 0; i < 5; i++) {
                                                            e[i] = items[i]
                                                        }
                                                        Book.find({
                                                                btype: '经济'
                                                            },
                                                            function(err, items) {
                                                                if (err) {
                                                                    return res.status(500).json({
                                                                        err_code: 500,
                                                                        message: err.message
                                                                    })
                                                                }
                                                                g[4] = items[9]
                                                                for (i = 0; i < 5; i++) {
                                                                    f[i] = items[i]
                                                                }


                                                                ////le.log(g)
                                                                if (!a[0]) {
                                                                    a = null
                                                                }
                                                                if (!b[0]) {
                                                                    b = null
                                                                }
                                                                if (!c[0]) {
                                                                    c = null
                                                                }
                                                                if (!d[0]) {
                                                                    d = null
                                                                }
                                                                if (!e[0]) {
                                                                    e = null
                                                                }
                                                                if (!f[0]) {
                                                                    f = null
                                                                }
                                                                if (!g[0]) {
                                                                    g = null
                                                                }

                                                                console.log(c);
                                                                res.render("type1.html", {
                                                                    user: req.session.user,
                                                                    Liter: a,
                                                                    Art: b,
                                                                    War: c,
                                                                    Fiction: d,
                                                                    Science: e,
                                                                    Econ: f,
                                                                    Week: g


                                                                })
                                                            })
                                                    })
                                            })
                                    })
                            })
                    })



            } else {
                Book.find(function(err, items) {
                    if (err) {
                        return res.status(500).send('server error')
                    }
                    res.render("type2.html", {
                        user: req.session.user,

                        All: items
                    })



                })

            }
        } else if (req.params.item == "Shopcar") {

            if (req.session.user == null) {
                res.redirect('/login')

            } else if (req.session.user.nickname == "master") {
                res.redirect('/items/Home')
            } else {
                var books = []
                var car = []
                var len = 1
                    ///.log(req.session.user)
                User.findById(req.session.user._id.replace(/"/g, ''),
                    function(err, items) {
                        if (err) {
                            return res.status(500).json({
                                err_code: 500,
                                message: err.message
                            })
                        }
                        ////nsole.log(items)
                        books = items.shopcar
                        len = books.length - 1

                        function Bj(len, books) {
                            Book.findOne({ name: books[len] }, function(err, items) {
                                if (err) {
                                    return res.status(500).send('server error')
                                }
                                if (len > 0) {
                                    car[len - 1] = items
                                    Bj(len - 1, books)


                                } else {
                                    // //le.log(car)
                                    res.render("shopcar.html", {
                                        user: req.session.user,
                                        Shopcar: car,
                                    })
                                }


                            })
                        }
                        Bj(len, books)

                    })
            }

        } else if (req.params.item == "Order") {

            if (req.session.user == null) {
                res.redirect('/login')

            } else if (req.session.user.nickname == "master") {
                res.redirect('/items/Home')
            } else {
                var books = []
                var car = []
                var len = 1

                User.findById(req.session.user._id.replace(/'/g, ''),
                    function(err, items) {
                        if (err) {
                            return res.status(500).json({
                                err_code: 500,
                                message: err.message
                            })
                        }

                        books = items.order
                        len = books.length - 1

                        function Bj(len, books) {
                            Book.findOne({ name: books[len] }, function(err, items) {
                                if (err) {
                                    return res.status(500).send('server error')
                                }
                                if (len >= 0) {
                                    car[len] = items
                                    Bj(len - 1, books)


                                } else {
                                    //  //le.log(car)
                                    res.render("order.html", {
                                        user: req.session.user,
                                        Order: car,
                                    })
                                }


                            })
                        }
                        Bj(len, books)

                    })
            }

        } else if (req.params.item == "Borrow") {
            if (req.session.user == null) {
                res.redirect('/login')

            } else if (req.session.user.nickname == "master") {
                res.redirect('/items/Home')
            } else {
                var a = []
                User.findById(req.session.user._id.replace(/'/g, ''),
                    function(err, items) {
                        if (err) {
                            return res.status(500).json({
                                err_code: 500,
                                message: err.message
                            })
                        }
                        var len = items.borrow.length
                            ////le.log(items)
                        for (var i = 0; i < len; i++) {
                            a[i] = items.borrow[i]
                        }
                        //  //le.log(a)
                        res.render("borrow.html", {
                            user: req.session.user,
                            Borrow: a,
                        })
                    })


            }
        } else if (req.params.item == "Userinfo") {
            if (req.session.user == null) {
                res.redirect('/login')

            } else {
                //  //le.log(req.session.user)
                User.findById(req.session.user._id, function(err, items) {
                    if (err) {
                        return res.status(500).send('server error')
                    }
                    items = JSON.parse(JSON.stringify(items))
                        // //le.log(items)
                    res.render("userinfo.html", {
                        Userinfo: items,
                        user: items,
                    })
                })





            }
        } else if (req.params.item == "Liter" || req.params.item == "Art" || req.params.item == "War" || req.params.item == "Fiction" || req.params.item == "Science" || req.params.item == "Econ") {
            // || req.params.item == "Art" || req.params.item == "War" || req.params.item == "Fiction" || req.params.item == "Science" || req.params.item == "Econ"
            var g = []
            Book.find({
                    btype: '文学'
                },
                function(err, items) {
                    if (err) {
                        return res.status(500).json({
                            err_code: 500,
                            message: err.message
                        })
                    }
                    g[0] = items[6]

                    Book.find({
                            btype: '艺术'
                        },
                        function(err, items) {
                            if (err) {
                                return res.status(500).json({
                                    err_code: 500,
                                    message: err.message
                                })
                            }
                            g[1] = items[8]

                            Book.find({
                                    btype: '军事'
                                },
                                function(err, items) {
                                    if (err) {
                                        return res.status(500).json({
                                            err_code: 500,
                                            message: err.message
                                        })
                                    }
                                    g[2] = items[9]

                                    Book.find({
                                            btype: '小说'
                                        },
                                        function(err, items) {
                                            if (err) {
                                                return res.status(500).json({
                                                    err_code: 500,
                                                    message: err.message
                                                })
                                            }
                                            g[3] = items[7]



                                            Book.find({
                                                    btype: '经济'
                                                },
                                                function(err, items) {
                                                    if (err) {
                                                        return res.status(500).json({
                                                            err_code: 500,
                                                            message: err.message
                                                        })
                                                    }
                                                    g[4] = items[9]



                                                    Book.find({
                                                            btype: req.query.type
                                                        },
                                                        function(err, items) {
                                                            if (err) {
                                                                return res.status(500).json({
                                                                    err_code: 500,
                                                                    message: err.message
                                                                })
                                                            }
                                                            ////le.log(items)
                                                            res.render("class.html", {
                                                                user: req.session.user,
                                                                Class: items,
                                                                type: req.query.type,
                                                                Week: g
                                                            })

                                                        }
                                                    )

                                                })
                                        })
                                })
                        })
                })


        } else if (req.params.item == "Product") {

            var g = []
            Book.find({
                    btype: '文学'
                },
                function(err, items) {
                    if (err) {
                        return res.status(500).json({
                            err_code: 500,
                            message: err.message
                        })
                    }
                    g[0] = items[6]

                    Book.find({
                            btype: '艺术'
                        },
                        function(err, items) {
                            if (err) {
                                return res.status(500).json({
                                    err_code: 500,
                                    message: err.message
                                })
                            }
                            g[1] = items[8]

                            Book.find({
                                    btype: '军事'
                                },
                                function(err, items) {
                                    if (err) {
                                        return res.status(500).json({
                                            err_code: 500,
                                            message: err.message
                                        })
                                    }
                                    g[2] = items[9]

                                    Book.find({
                                            btype: '小说'
                                        },
                                        function(err, items) {
                                            if (err) {
                                                return res.status(500).json({
                                                    err_code: 500,
                                                    message: err.message
                                                })
                                            }
                                            g[3] = items[7]



                                            Book.find({
                                                    btype: '经济'
                                                },
                                                function(err, items) {
                                                    if (err) {
                                                        return res.status(500).json({
                                                            err_code: 500,
                                                            message: err.message
                                                        })
                                                    }
                                                    g[4] = items[9]




                                                    Book.findById(req.query.id, function(err, items) {
                                                        if (err) {
                                                            return res.status(500).send('server error')
                                                        }
                                                        res.render("product.html", {
                                                            user: req.session.user,
                                                            Product: items,
                                                            Week: g
                                                        })
                                                    })

                                                })
                                        })
                                })
                        })
                })


        } else if (req.params.item == "Products") {


            Book.findById(req.query.id, function(err, items) {
                if (err) {
                    return res.status(500).send('server error')
                }
                res.render("product.html", {
                    user: req.session.user,
                    Product: items,
                })
            })

        }


    })
    //index1.html
router.get('/buts/:but', function(req, res) {
    if (req.params.but == "Addcar") {
        if (req.session.user == null) {
            res.redirect('/login')

        } else {
            var item = {}
            var add = ""
            var itemss = []

            Book.findById(req.query.id, function(err, items) {
                if (err) {
                    return res.status(500).send('server error')
                }
                // //le.log(items)
                itemss = items
                add = items.name
                item = req.session.user
                    //  //le.log(item)
                var a = item.shopcar.push(add)
                    //  //le.log(item)
                User.findByIdAndUpdate(item._id.replace(/'/g, ''), item, function(err) {
                    if (err) {
                        return res.status(500).send('Server error.')
                    }
                    res.render("product.html", {
                        user: req.session.user,
                        Product: itemss,
                    })
                })
            })



        }
    } else if (req.params.but == "Borrow") {
        if (req.session.user == null) {
            res.redirect('/login')

        } else {
            var item = {}
            var add = ""

            var itemdd = {}
                //  //le.log(req.query.id)
            Book.findById(req.query.id.replace(/"/g, ''), function(err, items) {
                if (err) {
                    return res.status(500).send('server rror')
                }
                ////le.log(items)
                add = items.name
                itemdd = items
                itemdd.num = itemdd.num - 1
                if (itemdd.num <= 0) {

                    Book.findByIdAndRemove(req.query.id.replace(/"/g, ''), function(err) {
                        if (err) {
                            return res.status(500).send('Server err.')
                        }
                        res.redirect('/items/Home/')
                    })
                } else {
                    //   //le.log(req.query)
                    Book.findByIdAndUpdate(req.query.id.replace(/"/g, ''), itemdd, function(err) {
                        if (err) {
                            return res.status(500).send('Server error.')
                        }
                        item = req.session.user
                        var a = item.borrow.push(add)
                        User.findByIdAndUpdate(item._id.replace(/'/g, ''), item, function(err) {
                            if (err) {
                                return res.status(500).send('Server e.')
                            }
                            res.render("product.html", {
                                user: req.session.user,
                                Product: itemdd,
                            })
                        })
                    })

                }
            })


        }

    } else if (req.params.but == "Order") {
        if (req.session.user == null) {
            res.redirect('/login')

        } else {
            var item = {}
            var add = ""
            var ad = ""
            var itemdd = {}
                //  //le.log(req.query.id)
            Book.findById(req.query.id.replace(/"/g, ''), function(err, items) {
                if (err) {
                    return res.status(500).send('server rror')
                }

                add = items.name

                ad = items.name
                itemdd = items
                itemdd.num = itemdd.num - 1
                if (itemdd.num <= 0) {

                    Book.findByIdAndRemove(req.query.id.replace(/"/g, ''), function(err) {
                        if (err) {
                            return res.status(500).send('Server err.')
                        }
                        res.redirect('/items/Home/')
                    })
                } else {
                    //   //le.log(req.query)
                    Book.findByIdAndUpdate(req.query.id.replace(/"/g, ''), itemdd, function(err) {
                        if (err) {
                            return res.status(500).send('Server error.')
                        }
                        //  .log(req.session.user)
                        User.findById(req.session.user._id.replace(/'/g, ''), function(err, item) {
                            if (err) {
                                return res.status(500).send('Server error.')
                            }
                            item = JSON.parse(JSON.stringify(item))
                                //.log(item)
                            var a = item.order.push(add)
                                // .log(item)
                                //.log(ad)
                            for (var i = 0; i < item.shopcar.length; i++) {

                                if (item.shopcar[i] == ad) {

                                    item.shopcar.splice(i, 1);
                                    i = i - 1
                                        // .log(ad)


                                }
                                if (i == item.shopcar.length - 1) {
                                    //  .log(item)
                                    User.findByIdAndUpdate(item._id.replace(/'/g, ''), item, function(err) {
                                        if (err) {
                                            return res.status(500).send('Server e.')
                                        }
                                        res.redirect("/items/Shopcar")
                                    })

                                }
                            }
                        })


                        //.log(item)


                    })

                }
            })


        }

    } else if (req.params.but == "Return") {
        if (req.session.user == null) {
            res.redirect('/login')

        } else {
            var item = {}
            var add = ""

            var itemadd = []
            Book.findById(req.query.id, function(err, items) {
                if (err) {
                    return res.status(500).send('server error')
                }

                add = items[0].name
                itemadd = items
            })
            itemss[0].num = itemss[0].num + 1
            if (itemss[0].num <= 0) {
                var id = itemss[0].id
                Book.findByIdAndRemove(id, function(err) {
                    if (err) {
                        return res.status(500).send('Server error.')
                    }
                    res.redirect('/items/Home/')
                })
            } else {
                Book.findByIdAndUpdate(req.query.id, itemss[0], function(err) {
                    if (err) {
                        return res.status(500).send('Server error.')
                    }

                })

            }
            item = req.session.user[0]
            var a = item.order.push(add)
            User.findByIdAndUpdate(item.id, item, function(err) {
                if (err) {
                    return res.status(500).send('Server error.')
                }

            })
            res.render("borrow.html", {
                user: req.session.user,
                Borrow: itemss,
            })

        }

    }
})
router.get('/buts/:but/edit', function(req, res) {


    // ////le.log(req.session.user)
    var path1 = ''
    if (req.params.but == 'Useredit') {
        path1 = "userEdit.html"
    } else if (req.params.but == 'Bookedit') {
        path1 = "edit.html"
    }
    var form = fs.readFileSync('./views/' + path1, { encoding: "utf8" });

    if (req.params.but == "Useredit") {
        //res.send(req.params.id)

        res.render(path1, {
            Userinfo: req.session.user,

        })



    }
    //res.send(req.params.id)
    else if (req.params.but == "Bookedit") {
        ////le.log(req.query.id)
        Book.findById(req.query.id.replace(/"/g, ''), function(err, items) {
            if (err) {
                return res.status(500).send('server error')
            }
            res.render(path1, {

                book: items,

            })

        })
    }

})
router.get('/buts/:but/new', function(req, res) {
    if (req.params.but == "Addbook") {
        var form = fs.readFileSync('./views/' + "new.html", { encoding: "utf8" });
        res.render('new.html')
    } else {
        var a = []
        var b = 0
        User.find(function(err, items) {
            if (err) {
                return res.status(500).send('server error')
            }
            for (var i = 0; i < items.length; i++) {
                if (items[i].nickname != "master") {
                    a[b] = items[i]
                    b = b + 1
                }

            }
            a = JSON.parse(JSON.stringify(a))
                // //le.log(a)
            res.render("deluser.html", {
                user: a,
                User: a
            })

        })
    }
})






router.post('/buts/:but/edit', upload.single('logo'), function(req, res) {

    var id = req.body.id.replace(/"/g, '')
        ////le.log(req.body)

    if (req.params.but == "Bookedit") {

        req.body.path = req.file.originalname
        Book.findByIdAndUpdate(id, req.body, function(err) {
            if (err) {
                return res.status(500).send('Server error.')
            }
            res.redirect('/items/Home')
        })
    } else if (req.params.but == "Useredit") {
        //le.log(req.body)
        User.findByIdAndUpdate(req.body.id.replace(/"/g, ''), req.body, function(err) {
            if (err) {
                return res.status(500).send('Server error.')
            }
            //le.log(req.session.user)
            res.redirect('/items/Userinfo')
        })
    }
})

router.get('/delete', function(req, res) {
    var id = req.query.id.replace(/"/g, '')
    Book.findByIdAndRemove(id, function(err) {
        if (err) {
            return res.status(500).send('Server error.')
        }
        res.redirect('/items/Home/')
    })

})

router.get('/Deluser', function(req, res) {
    // 清除登陆状态
    var id = req.query.id
        ////le.log(id)
    User.findByIdAndRemove(id, function(err) {
        if (err) {
            return res.status(500).send('Server error.')
        }
        res.redirect('/buts/Deluser/new')
    })
})
router.post('/addbook/new', upload.array('logo', 10), function(req, res) {

    var body = req.body
    console.log(req.body);
    var a = [];
    for (var i = 0; i < req.files.length; i++) {
        a[i] = req.files[i].originalname
    }
    console.log(req.file);
    req.body.path = a[0]
    console.log(a);
    console.log(body);

    Book.findOne({
            name: body.name
        },
        function(err, data) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: '服务端错误'
                })
            }
            // ////le.log(data)
            if (data) {
                return res.status(200).json({
                    err_code: 1,
                    message: 'nickname aleady exists.'
                })

            }

            // 对密码进行 md5 重复加密


            new Book(body).save(function(err, user) {
                if (err) {
                    return res.status(500).json({
                        err_code: 500,
                        message: 'Internal error.'
                    })
                }

                // 注册成功，使用 Session 记录用户的登陆状态


                // Express 提供了一个响应方法：json
                // 该方法接收一个对象作为参数，它会自动帮你把对象转为字符串再发送给浏览器


                // 服务端重定向只针对同步请求才有效，异步请求无效
                res.redirect('/items/Home')
            })
        })
})

module.exports = router