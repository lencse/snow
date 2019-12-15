import { init } from './lib'

self.onmessage = (e: MessageEvent) => {
    if ('INIT' === e.data.action) {
        const target: any = e.target
        init(e.data.dimension, (snowflakes) => {
            target.postMessage({
                action: 'DRAW',
                snowflakes
            })
        })
    }
}

export default {}
