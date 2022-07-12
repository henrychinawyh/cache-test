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
(1) Last-Modified依赖于文件的修改时间。且Last-Modified只能读取到秒级别因此在一秒内多次修改，他就不能准确地标注修改时间
(2) 如果某些文件定期生成但是内容没有修改，这会导致Last-Modified修改，不能使用缓存
(3) Last-Modified未能准确获取文件修改时间，这也可能导致缓存BUG

5. Etag（INode索引节+MTime+Size）进行hash
是用来给内容已经被修改过的资源打上唯一的身份签名：这就补充了资源使用Last-Modified不能通过修改时间正确获取到资源内容的修改状态
Etag也有自己的一些缺陷：
(1) Etag的强校验是根据文件内容逐字节进行匹对，当所有字节都能匹配上时，使用缓存，否则更新缓存信息，如果逐字节进行匹对的话，这就非常消耗服务器的性能和时间
(2) Etag的弱校验不会根据文件内容逐字节进行匹配，而是通过文本内容本身的语意或者时文本本身一些属性来计算，因此在时间和性能上都要比强缓存好
但是使用弱校验就无法从文件更


