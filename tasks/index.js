/*
 * 基于grunt的文本内容替换组件
 * https://github.com/lh2907883/grunt-art-reactor
 *
 * Copyright (c) 2015-7-2 lihao
 * Licensed under the MIT.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('artReactorBuild', '', function() {

    // Merge task-specific and/or target-specific options with these defaults.
    // var options = this.options({
    //   punctuation: '.',
    //   separator: ', '
    // });

    //console.log(JSON.stringify(this.data.options.regex));
    var outputType = this.data.options.outputType;

    var generate = {
      less: function(file, data){
        var content = "";
        for(var i=0; i<data.length; i++){
          var group = data[i];
          if(group){
            content += '//----------' + group.title + '----------\r';
            for(var j=0; j<group.data.length; j++){
              var item = group.data[j];
              content += '//' + item.des + '\r';
              content += '.ar-' + item.cls + ':after {\r';
              content += '\tcontent: "\\' + item.cont + '";\r';
              content += '}\r';
            }
          }
        }
        grunt.file.write(file, content);

      },
      json: function(file, data){
        grunt.file.write(file, 'var data = ' + JSON.stringify(data));
      }
    };

    this.files.forEach(function(f) {
      if(f.src.length > 0){
        var content = grunt.file.read(f.src[0]);
        content = content.replace(/[\s]/gm, "");
        var table = /(###[^<]*)?<table>[\S]+?<\/table>/ig;
        var title = /###([^#<]+)/;
        var tr = /<tr>[\S]+?<\/tr>/ig;
        var td = /^<tr>[^<>]*<td>([^<\/>]+)<\/td>[^<>]*<td>([^<\/>]+)<\/td>[^<>]*<td>[$]([^<\/>]+)<\/td>[^<>]*<\/tr>$/i;

        var ms0 = content.match(table);
        if(ms0){
          var res = ms0.map(function(tb){
            // grunt.log.error(tb);
            var mt = tb.match(title);
            var oTable = {
              title: mt ? mt[1] : ''
            };
            var ms = tb.match(tr);
            if(ms){
              oTable.data = ms.map(function(item){
                var m = item.match(td);
                if(m){
                  return {
                    des: m[1],
                    cls: m[2],
                    cont: m[3]
                  }
                }
                else{
                  grunt.log.error("忽略一个错误行! " + item);
                }
              });
              return oTable
            }
          });
          grunt.log.oklns(JSON.stringify(res));
        }
        if(generate[outputType]){
          generate[outputType](f.dest, res)
        }

        // var ms = content.match(tr);
        // if(ms){
        //   var res = ms.map(function(item){
        //     var m = item.match(td);
        //     if(m){
        //       return {
        //         des: m[1],
        //         cls: m[2],
        //         cont: m[3]
        //       }
        //     }
        //     else{
        //       grunt.log.error("忽略一个错误行! " + item);
        //     }
        //   });
        //   grunt.log.ok("找到" + res.length + "组匹配.");
        //   if(generate[outputType]){
        //     generate[outputType](f.dest, res)
        //   }         
        // }
        // else{
        //   grunt.log.error("一个Tr都没有找到,搞毛线?");
        // }
      }
    });
  });
};
