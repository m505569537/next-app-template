const next = require('next')
const Koa = require('koa')
const cp = require('child_process')
const config = require('./next.config')

// const { serverRuntimeConfig, publicRuntimeConfig } = config

// const { PORT } = serverRuntimeConfig
// const { isDev } = publicRuntimeConfig

const app = next({ dir: '.', dev: true })

const handle = app.getRequestHandler()

app.prepare().then(() => {
    const server = new Koa();

    server.use(async (ctx, next) => {
        await handle(ctx.req, ctx.res)
    })

    server.listen(8080, (err) => {
        if(err) {
            throw err
        }
        const url = `http://localhost:${8080}`
        console.log('ready on ' + url);
        if(true) {
            switch(process.platform) {
                case 'darwin':
                    cp.exec(`open ${url}`)
                    break
                case 'win32':
                    cp.exec(`start ${url}`)
                    break
                default:
                    cp.exec(`open ${url}`)
            }
        }
    })
})