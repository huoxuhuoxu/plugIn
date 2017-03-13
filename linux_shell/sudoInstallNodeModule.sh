# js一键部署环境
# 后端支持express+mongodb+ws+redis+seneca+mocha...
# 前端支持react+jQuery+router+redux+babel+gulp+es6+es7+browserify...


echo -e "\n开始前端环境检测...\n"

echo -e "需要部署环境的项目路径为: \c"
pwd
echo ''

if test -e package.json
then
    echo -e '检测完成 \n'
else
    echo -e "当前不存在package文件,请先npm init初始化此文件 \n"
    exit 0
fi

echo -e "loading...\n"

process_npm=npm
# 如果后面有跟随 且为 －c 则启用cnpm安装模块
# 需要在添加一种兼容: 没有安装cnpm情况下 使用--register 走淘宝镜像
if [[ $# -eq 1 && "$1" = "-c" ]]
then
    process_npm=cnpm
    echo -e '以cnpm模式安装模块\n'
else
    echo -e "以npm模式安装模块\n"
fi


my_engine=(
	'gulp'
	'gulp-concat'
	'gulp-uglify'
	'gulp-rename'
    'gulp-load-plugins'
	'babel-plugin-transform-runtime'
	'babel-polyfill'
	'babel-preset-es2015'
	'babel-preset-react'
	'babel-preset-stage-0'
	'babelify'
	'body-parser'
	'browserify'
	'express'
	'express-session'
	'express3-handlebars'
	'gulp-babel'
	'gulp-plumber'
	'jquery'
	'mongoose'
	'react'
	'react-dom'
	'react-router'
	'redux'
    	'react-redux'
	'silly-datetime'
	'vinyl-source-stream'
	'ws'
	'ioredis'
	'cookie-parser'
	'node-uuid'
	'seneca'
	'mocha'
	'serve-favicon'
	'morgan'
	'webpack'
	'babel-core'
	'babel-loader'
	'url-loader'
	'style-loader'
	'npm-zepto'
	'css-loader'
)


for engine in ${my_engine[@]}
do
   sudo $process_npm install ${engine} --save-dev
   echo "完成:${engine}"
done

if [ ! -e webpack.config.js ]
then
	echo -e '开始配置webpack文件'
	touch webpack.config.js
	echo -e '\n' >> webpack.config.js
	echo -e 'var path = require("path");' >> webpack.config.js
	echo -e 'var webpack = require("webpack")' >> webpack.config.js
	echo -e 'module.exports=(options = {}) => {};' >> webpack.config.js

fi

echo -e 'webpack.config.js 配置完成...'


# 检测是否存在 gulpfile.js 文件
if [ ! -e gulpfile.js ]
then
    echo -e '开始配置gulpfile文件'
    touch gulpfile.js

    echo -e '// 配置指令\n' >> gulpfile.js
    echo 'var gulp = require("gulp");' >> gulpfile.js
    echo 'var concat = require("gulp-concat");' >> gulpfile.js
    echo 'var rename = require("gulp-rename");' >> gulpfile.js
    echo 'var uglify = require("gulp-uglify");' >> gulpfile.js
    echo -e 'var plumber = require("gulp-plumber");\n' >> gulpfile.js

    echo -e 'var glp = require("gulp-load-plugins");\n' >> gulpfile.js

    echo 'var babelify = require("babelify");' >> gulpfile.js
    echo 'var browserify = require("browserify");' >> gulpfile.js
    echo 'var babel = require("gulp-babel");' >> gulpfile.js
    echo 'var source = require("vinyl-source-stream");' >> gulpfile.js

    echo -e '\n\n\n\n\n\n\n\n\n\n' >> gulpfile.js

    echo -e '......\n'
fi

echo -e "\ncomplete!\n"














