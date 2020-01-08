const webpack = require('webpack');
const path = require('path');
const withCss = require('@zeit/next-css');
const withLess = require('@zeit/next-less');
const withTM = require('next-transpile-modules');
const cssLoaderGetLocalIdent = require('css-loader/lib/getLocalident.js');

const NODE_ENV = process.env.NODE_ENV;
const BUILD_ENV = process.env.BUILD_ENV;
const isDev = BUILD_ENV == 'development';    //本地开发环境
const isBeta = BUILD_ENV == 'beta';     //测试环境
const isPro = BUILD_ENV == 'production';    //线上环境

module.exports = withCss(withLess(withTM({
    distDir: 'dist',
    // 是 'js' 不是 '.js'
    pageExtensions: ['js', 'jsx'],

    transpileModules: ['antd'],
    
    cssModules: true,
    cssLoaderOptions: {
        importLoaders: 1,
        camelCase: true,
        localIdentName: '[local]__[hash:base64:5]',
        getLocalIdent: (context, localIdentName, localName, options) => {
            let hz = context.resourcePath.replace(context.rootContext, '');
            if(/node_modules/.test(hz)) {
                return localName
            } else {
                return cssLoaderGetLocalIdent(
                    context,
                    localIdentName,
                    localName,
                    options
                )
            }
        }
    },

    lessLoaderOptions: {
        javascriptEnabled: true
    },

    webpack: (config, { buildId, dev, isServer, defaultLoaders }) => {
        // 配置antd
        if (isServer) {
            // 通过isServer区分服务端和客户端
            const antStyles = /antd\/.*?\/style\/css.*?/;
            const origExternals = [...config.externals];
            config.externals = [
            (context, request, callback) => {
                if (request.match(antStyles)) return callback();
                if (typeof origExternals[0] === 'function') {
                origExternals[0](context, request, callback);
                } else {
                callback();
                }
            },
            ...(typeof origExternals[0] === 'function' ? [] : origExternals),
            ];
            
            config.module.rules.unshift({
            test: antStyles,
            use: 'null-loader',
            });
        }

        config.plugins.push(
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
                'process.env.BUILD_ENV': JSON.stringify(BUILD_ENV)
            })
        )
        return config
    },

    serverRuntimeConfig: {
        rootDir: path.join(__dirname, './'),
        PORT: isDev ? 8080 : (process.env.PORT || 6789)
    },
    publicRuntimeConfig: {
        isDev,
        isBeta
    }
})))