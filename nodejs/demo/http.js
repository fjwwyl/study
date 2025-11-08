const http = require("http");

//中间件

class Middleware {
    constructor(props) {

        this.middlewares = [];

    }

    use(fn) {
        this.middlewares.push(fn);
    }

    run(req, res) {
        console.log(1);
        //执行顺序先进先出  类似于一个栈
        // const len = this.middlewares.length;
        // for (let i = 0; i < len; i++) {
        //     const
        //
        // }


        let index = 0;
        const next = () => {
            if (index < this.middlewares.length) {
                const middleware = this.middlewares[index++];
                middleware(req, res, next);
            } else {
                res.end("No more middleware");
            }
        };
        next();
    }
}

const app = new Middleware();
app.use((req, res, next) => {
    console.log("1111");
    next();
})
app.use((req, res, next) => {
    console.log("2222");
    next();
})
app.use((req, res, next) => {
    console.log("3333");
})

http.createServer((req, res) => {
    // const base = "http://" + req.headers.host;
    //
    // const url = new URL(req.url, base);
    //
    //
    // const page = url.searchParams.get("page");
    //
    // res.setHeader("Centent-Type", "text/html;charset=utf-8");
    // res.end(`url:${url},page:${page}`);

    if (req.url === '/favicon.ico') {
        res.writeHead(204); // No Content
        res.end();
        return;
    }

    app.run(req, res);
}).listen(3000, () => {
    console.log("3000成功")
})