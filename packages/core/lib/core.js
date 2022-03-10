#!/usr/bin/env node
'use strict';

const yargs = require('yargs')
const { hideBin } = require('yargs/helpers')
const util = require('@kyle-cli/util')
const kyleVersion = require('../package.json')


function core() {
    // TODO
    const argv = hideBin(process.argv);
    const cli = yargs();
    cli
    .strict()   //严格模式，如果有不能识别的参数，则会提示
    .usage("Usage: $0 <command> [options]")  //命令的用法提示,$0表示取argv中第0个参数
    .demandCommand(1, "必须要有一个命令. 输入 --help 查看命令和选项。") //最少需要有的命令数，和提示
    .recommendCommands()  //推荐命令，当输入命令出错时，匹配最相似的命令并给出推荐
    .alias("h", "help")     //设置别名支持 -h
    .alias("v", "version")  //设置别名支持 -v
    .wrap(cli.terminalWidth())  //wrap设置打印内容的宽度，cli.terminalWidth可以获取到当前终端宽度。这行代码意为打印内容宽度刚好填满终端
    .epilogue(`For more information, find our manual at https://github.com/Ssis53/kyle-cli`)    //为底部说明，类似于脚标
    .options({
        debug: {
            type: 'string',     //类型
            alias: 'd',         //参数别名
            describe: '开启调试模式',  //参数说明
            demandOption: false,    //是否必须
            hidden: true,    //隐藏命令，一般给开发的时候用
        },
        spec: {
            type: 'string',
            alias: 's',
            describe: '开始测试',
            demandOption: false
        }
    })   //增加多个option参数选项
    .option('old', {
        type: 'string',
        alias: 'o',
        describe: '老的版本',
        demandOption: false
    })  //增加一个option参数选项
    .group(['spec', 'old'], '扩展命令')   //对命令做一个分组
    /**
      * .command注册一个命令，第一个参数为命令名称create和参数name；第二个参数为命令说明
      * 第三个参数是一个builder函数；可以对yargs做一系列配置修改，此处注册的option是命令
      * 的选项；第四个参数是一个handler函数，能够拿到命令和参数argv然后进行实际操作
     */
    .command('create [name]', '创建一个新项目', (yargs) => {
        // builder函数，对yargs增加额外的配置
        return yargs.option('name', {
            type: 'string',
            alias: 'n',
            demandOption: true,
            describe: '项目名称'
        })
    }, (argv) => {
        //handler函数，执行命令具体的业务
        console.log('create 命令执行了', argv);
    })
    /**
     *  传入一个对象用key:val的形式也可以注册command
     */
    .command({
        command: 'list',
        aliases: ["ls", "la", "ll"],
        describe: '列出本地包名',
        builder: (yargs) => {

        },
        handler: (argv) => {
            console.log('list 命令执行', argv);
        }
    })
    .fail((msg, err, yargs) => {
        //当输入命令错误执行失败时，可以自定义提示，或者做一些错误处理
        console.log('err', err);
        console.log('msg', msg);
    })
    .parse(argv, {kyleVersion: kyleVersion.version});  // 1.类似于commander中program的parse，实例化之后，要parse才生效; 2.parse可以将用户输入的命令和参数与开发者想要注入的命令和参数合并成一个对象
}

core();
util();