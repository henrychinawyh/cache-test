1. Expires: 
服务器返回的过期时间，浏览器会严重依赖本地时间与其比对，若本地时间发生修改，则使用缓存会出现bug，例如将本地时间调整
至过期时间后，则强缓存失效

2. Catch-Control
HTTP/1.1新增的缓存字段，因此在HTTP/1.0下无法使用Cache-Control: no-catch；HTTP推出了Pragma: no-cache 功能与Cache-Control: no-cache一样，并且可以在HTTP/1.1 以及 HTTP/1.0中使用，优先级比 Cache-Control更高

3. Cache-Control中的public以及private
指的是是否让代理服务器进行缓存
private: 不允许代理服务器进行缓存，只能缓存到客户端本地
public: 既允许代理服务器缓存，也可以缓存到客户端本地

4. Last-Modified的缺点
(1) Last-Modified依赖于文件的修改时间。如果
