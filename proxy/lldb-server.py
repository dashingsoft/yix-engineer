#! /usr/bin/env python
"""
This script is used to connect LLDB and CodeBang by http server.

Note:

  In MacOS if lldb is installed within XCode, start any command with `xcrun`

    xcrun python3 lldb-server.py

  Refer to
  https://lldb.llvm.org/resources/caveats.html#lldb-in-xcode-on-macos

"""
import argparse
import logging
import json
import os
import posixpath
import shutil
import sys

from subprocess import Popen

try:
    from urllib import unquote
except Exception:
    from urllib.parse import unquote
try:
    from BaseHTTPServer import BaseHTTPRequestHandler
except ImportError:
    from http.server import BaseHTTPRequestHandler
try:
    import SocketServer as socketserver
except ImportError:
    import socketserver

try:
    import lldb
except ImportError:
    sys.path.append('/Applications/Xcode.app/Contents/SharedFrameworks/'
                    'LLDB.framework/Resources/Python3')
    import lldb


__version__ = '1.0.0'
__wwwroot__ = os.path.expanduser(os.path.join('~', '.codebang'))


class BaseServer(object):

    def dispatch(self, path, args):
        i = path.find('/')
        if i == -1:
            name = 'default' if path == '' else path
            if hasattr(self, 'do_' + name):
                return getattr(self, 'do_' + name)(args)
            raise RuntimeError('No route for %s', name)
        else:
            name = path[:i]
            for handler in self.children:
                if handler.name == name:
                    return handler.dispatch(path[i+1:], args)
            raise RuntimeError('No route for %s', name)

    def do_default(self, args):
        pass


class FileServer(BaseServer):

    def do_default(self, kwargs):
        path = kwargs.get('path', '')
        filename = kwargs.get('filename')
        content = kwargs.get('content')

        fullpath = os.path.join(__wwwroot__, path)
        if not os.path.exists(fullpath):
            os.makedirs(fullpath)

        if filename and content:
            with open(os.path.join(fullpath, filename), 'w') as f:
                f.write(content)
        return 'OK'


class CompileServer(BaseServer):

    def do_default(self, filename):
        path = os.path.join(__wwwroot__, os.path.dirname(filename))
        name = os.path.basename(filename)
        output = os.path.splitext(name)[0] + '.exe'
        cmd = ['gcc', '-g', '-o', output, name]
        p = Popen(cmd, cwd=path)
        p.wait()
        if p.returncode != 0:
            raise RuntimeError('Compile file failed (%s)' % p.returncode)


class DebugServer(BaseServer):

    def __init__(self):
        self.debugger = lldb.SBDebugger.Create()
        self.debugger.SetAsync(False)
        self.interpreter = self.debugger.GetCommandInterpreter()
        self.res = lldb.SBCommandReturnObject()
        self.target = None

    def do_default(self, args):
        return self.do_command(args)

    def do_command(self, cmd):
        if not cmd:
            if self.target is None:
                return lldb.eStateInvalid
            process = self.interpreter.GetProcess()
            if process is None:
                return lldb.eStateInvalid
            state = process.GetState()
            return state

        self.res.Clear()
        self.interpreter.HandleCommand(cmd, self.res)
        if self.res.Succeeded():
            return 'OK'
        raise RuntimeError(str(self.res))

    def _disassemble(self, insts):
        for i in insts:
            print(i)

    def do_load(self, filename):
        self.target = self.debugger.CreateTarget(filename)
        if self.target:
            return 'OK'
        raise RuntimeError('Load %s failed' % filename)

    def do_info(self, name):
        meminfo = lldb.SBMemoryRegionInfo()
        if name == 'memory':
            process = self.interpreter.GetProcess()
            minfolist = process.GetMemoryRegions()
            for i in range(10):
                if minfolist.GetMemoryRegionAtIndex(i, meminfo):
                    print('Got %d name: %s' % (i, meminfo.GetName()))
                else:
                    print('Got %d name: %s' % (i, 'failed'))
                    break


class HelperHandler(BaseHTTPRequestHandler):

    server_version = "HelperHTTP/" + __version__
    router = {
        'file': FileServer(),
        'debugger': DebugServer(),
        'compiler': CompileServer()
    }

    def do_OPTIONS(self):
        """Serve a OPTIONS request."""
        self.send_response(204)
        self.send_header("Access-Control-Allow-Methods", "GET,POST,OPTIONS,PUT")
        self.send_header("Access-Control-Allow-Headers", "*")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()

    def do_POST(self):
        """Serve a POST request."""
        t = self.headers.get('Content-Type')
        self.log_message("Content-Type: %s", t)

        n = int(self.headers.get('Content-Length', 0))
        args = json.loads(self.rfile.read(n).decode()) if n else None
        self.log_message("Post-Data: %s", args)

        result = dict(err=0)
        try:
            routes = self.path.strip('/').split('/')
            name = routes[1]
            cmd = '/'.join(routes[2:])
            result['data'] = self.router[name].dispatch(cmd, args)
        except Exception as e:
            logging.exception("Failed to handle request")
            result['err'] = 1
            result['data'] = str(e)

        if result:
            data = json.dumps(result).encode()
            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.send_header("Content-Length", str(len(data)))
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
            self.send_header("Access-Control-Allow-Headers", "Content-Type")
            self.send_header("Last-Modified", self.date_time_string())
            self.end_headers()
            self.wfile.write(data)

    def do_GET(self):
        """Serve a GET request."""
        f = self.send_head()
        if f:
            self.copyfile(f, self.wfile)
            f.close()

    def do_HEAD(self):
        """Serve a HEAD request."""
        f = self.send_head()
        if f:
            f.close()

    def send_head(self):
        """Common code for GET and HEAD commands.

        This sends the response code and MIME headers.

        Return value is either a file object (which has to be copied
        to the outputfile by the caller unless the command was HEAD,
        and must be closed by the caller under all circumstances), or
        None, in which case the caller has nothing further to do.

        """
        path = self.translate_path(self.path[1:])
        f = None
        if os.path.isdir(path):
            files = os.listdir(path)
            data = json.dumps(files)
            self.wfile.write(data.encode())
            self.send_response(200)
            self.send_header("Content-type", 'application/json')
            self.send_header("Content-Length", len(data))
            self.send_header("Last-Modified", self.date_time_string())
            self.end_headers()
            return None

        ctype = self.guess_type(path)
        try:
            # Always read in binary mode. Opening files in text mode may cause
            # newline translations, making the actual size of the content
            # transmitted *less* than the content-length!
            f = open(path, 'rb')
        except IOError:
            self.send_error(404, "File not found")
            return None
        self.send_response(200)
        self.send_header("Content-type", ctype)
        fs = os.fstat(f.fileno())
        self.send_header("Content-Length", str(fs[6]))
        self.send_header("Last-Modified", self.date_time_string(fs.st_mtime))
        self.end_headers()
        return f

    def translate_path(self, path):
        """Translate a /-separated PATH to the local filename syntax.

        Components that mean special things to the local file system
        (e.g. drive or directory names) are ignored.  (XXX They should
        probably be diagnosed.)

        """
        if path.startswith('proxy/file'):
            path = path[len('proxy/file')+1:]
        # abandon query parameters
        path = path.split('?', 1)[0]
        path = path.split('#', 1)[0]
        path = os.path.join(__wwwroot__, unquote(path))
        return posixpath.normpath(path)

    def copyfile(self, source, outputfile):
        """Copy all data between two file objects.

        The SOURCE argument is a file object open for reading
        (or anything with a read() method) and the DESTINATION
        argument is a file object open for writing (or
        anything with a write() method).

        The only reason for overriding this would be to change
        the block size or perhaps to replace newlines by CRLF
        -- note however that this the default server uses this
        to copy binary data as well.

        """
        shutil.copyfileobj(source, outputfile)

    def guess_type(self, path):
        """Guess the type of a file.

        Argument is a PATH (a filename).

        Return value is a string of the form type/subtype,
        usable for a MIME Content-type header.

        The default implementation looks the file's extension
        up in the table self.extensions_map, using application/octet-stream
        as a default; however it would be permissible (if
        slow) to look inside the data to make a better guess.

        """

        base, ext = posixpath.splitext(path)
        if ext in self.extensions_map:
            return self.extensions_map[ext]
        ext = ext.lower()
        if ext in self.extensions_map:
            return self.extensions_map[ext]
        else:
            return self.extensions_map['']

    extensions_map = {
        '': 'application/octet-stream',
        '.c': 'text/plain',
        '.h': 'text/plain',
        '.svg': 'image/svg+xml',
        '.css': 'text/css',
        '.html': 'text/html',
        '.js': 'application/x-javascript',
        }


def main(argv=None):
    logging.basicConfig(
        level=logging.INFO,
        format='%(levelname)-8s %(message)s',
    )
    parser = argparse.ArgumentParser(
        prog='lldb-server',
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument('-v', '--version', action='version',
                        version=__version__)
    parser.add_argument('-p', '--port', type=int, default=9099,
                        help='Serve port, default is 9096')
    parser.add_argument('-H', '--host', default='localhost',
                        help='Bind host, default is localhost')
    args = parser.parse_args(sys.argv[1:] if argv is None else argv)

    server = socketserver.TCPServer((args.host, args.port), HelperHandler)
    logging.info("Serving HTTP on %s port %s ...", *server.server_address)
    server.serve_forever()


if __name__ == '__main__':
    main()
