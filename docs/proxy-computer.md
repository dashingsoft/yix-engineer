# 计算机代理服务器

通过 HTTP Server 提供访问计算机文件，编译器和调试器的代理接口。

如果没有特别说明，API 调用时候 HTTP 头部默认指定

    Content-Type: application/json

测试地址为: http://localhost:9099/

例如，列出本地课程

```
curl \
  -X GET \
  -H "Content-Type: application/json" \
  http://localhost:9099/proxy/file/
```

## 文件管理

创建/修改/删除/查询本地文件和目录（课程）

请求地址

    https://SERVER/proxy/file/

### 创建课程或者课程文件

请求方法: POST

请求地址

    https://SERVER/proxy/file/

传入参数:

| 参数        | 类型   | 非空 | 长度 | 描述 |
|------------|--------|-----|------|------|
| path       | String | 是  |      |      |
| filename   | String | 否  |      |      |
| content    | String | 否  |      |      |

成功返回 HTTP/1.1 200 OK

### 列出课程文件和读取文件内容

请求方法: GET

请求地址

    https://SERVER/proxy/file/PATH

成功返回 HTTP/1.1 200 OK

如果是目录，则返回一个文件列表
如果是文件，返回文件内容

错误返回 HTTP/1.1 400 BAD_REQUEST

例如

    curl http://localhost:9099/proxy/file/course-0
    curl http://localhost:9099/proxy/file/course-0/foo.c

## 文件编译

编译程序文件。

请求地址

    https://SERVER/proxy/compiler/

请求方法: POST

传入参数: 本地文件名称

成功返回 HTTP/1.1 200 OK

返回参数:

    {
    "output": "course-0/foo.exe",
    }

错误返回 HTTP/1.1 400 BAD_REQUEST

返回参数:  编译错误信息

    {
    "errors": [ "Line 10, Syntax error", ... ]
    }

例如，编译一个课程文件

```
curl \
  -X GET \
  -H "Content-Type: application/json" \
  -d '"course-0/foo.c"'
  http://localhost:9099/proxy/compiler/
```

## 调试器

执行调试命令，目前支持 lldb 和 gdb 两种类型

请求地址前缀

    http://localhost:9099/proxy/debugger/

### 执行调试器命令

请求地址

    http://localhost:9099/proxy/debugger/command/

请求方法: POST

传入参数: 命令字符串

成功返回 HTTP/1.1 200 OK

返回参数:

    {
    "data": "OK",
    }

错误返回 HTTP/1.1 400 BAD_REQUEST

返回参数:  错误代码和错误信息

    {
    "err": 1,
    "data": "Something is wrong"
    }
