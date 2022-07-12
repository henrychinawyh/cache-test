const http = require("http");
const url = require("url");
const fs = require("fs");
const utils = require("util");
const etag = require("etag");

const { promisify } = utils;

let readFilePromisify = promisify(fs.readFile);

http
  .createServer(async (req, res) => {
    const { pathname } = url.parse(req.url);

    if (pathname === "/favicon.ico") {
      return false;
    }

    console.log(pathname);

    if (pathname === "/") {
      const htmlContent = await readFilePromisify("../index.html");
      res.end(htmlContent);
    } else if (pathname === "/images/01.webp") {
      // 强缓存-Expires，注意在chrome的控制台不需要打开 disabeled cache，设置过期时间，时间依赖本地计算机时间
      const img1Buffer = await readFilePromisify("../images/01.webp");
      res.writeHead(200, {
        Expires: new Date(`2022-7-12 10:35:59`).toUTCString(),
      });

      res.end(img1Buffer);
    } else if (pathname === "/images/02.webp") {
      // 强缓存-cache-control,此时cache control需要设置max-age 用以兼容之前的expires，单位为秒，设置过期时长
      const img2Buffer = await readFilePromisify("../images/02.webp");

      res.writeHead(200, {
        "Cache-Control": "max-age=10",
      });

      res.end(img2Buffer);
    } else if (pathname === "/images/03.webp") {
      // 协商缓存 Last-Modified(服务端) 和 客户端(If-Modified-Since)
      const { mtime } = fs.statSync("../images/03.webp"); // 获取文件属性状态中的修改时间mtime(Date类型)

      if (req.headers["if-modified-since"] === mtime.toUTCString()) {
        res.statusCode = 304;
        res.end();
      } else {
        const img3Buffer = await readFilePromisify("../images/03.webp");

        res.writeHead(200, {
          "Last-Modified": mtime.toUTCString(),
          Pragma: "no-cache", // 用以告知客户端，下次请求强缓存失效后需要协商缓存
        });

        res.end(img3Buffer);
      }
    } else if (pathname === "/images/04.webp") {
      // 协商缓存 Last-Modified(服务端) 和 客户端(If-Modified-Since)
      const { mtime } = fs.statSync("../images/04.webp"); // 获取文件属性状态中的修改时间mtime(Date类型)

      if (req.headers["if-modified-since"] === mtime.toUTCString()) {
        res.statusCode = 304;
        res.end();
      } else {
        const img4Buffer = await readFilePromisify("../images/04.webp");

        res.writeHead(200, {
          "Last-Modified": mtime.toUTCString(),
          "Cache-Control": "no-cache", // 用以告知客户端，下次请求强缓存失效后需要协商缓存
        });

        res.end(img4Buffer);
      }
    } else if (pathname === "/images/05.webp") {
      const img5Buffer = await readFilePromisify("../images/05.webp");
      const etagContent = etag(img5Buffer); // 根据读取到的文件二进制流生成etag指纹签名

      if (req.headers["if-none-match"] === etagContent) {
        res.statusCode = 304;
        res.end();
      } else {
        res.writeHead(200, {
          Etag: etagContent,
          "Cache-Control": "no-cache", // 用以告知客户端，下次请求强缓存失效后需要协商缓存
        });
        res.end(img5Buffer);
      }
    } else {
      res.statusCode = 404;
      res.end();
    }
  })
  .listen(3000);
