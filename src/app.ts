import { Dimension } from './lib'

window.addEventListener('load', () => {
    const worker = new Worker('worker.js')
    const canvas: any = document.getElementById('canvas')
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d')
    const dimension: Dimension = {
        width: canvas.clientWidth,
        height: canvas.clientHeight
    }

    worker.postMessage({
        dimension,
        action: 'INIT'
    })

    worker.onmessage = (e) => {
        if ('DRAW' === e.data.action) {
            ctx.beginPath()
            ctx.fillStyle = '#111'
            ctx.fillRect(0, 0, dimension.width, dimension.height)
            e.data.snowflakes.forEach((snowflake: number[]) => {
                ctx.fillStyle = '#fff'
                ctx.fillRect(snowflake[0], snowflake[1], 1, 1)
            })
        }
    }
})
