const { random, round } = Math

export interface Dimension {
    width: number
    height: number
}

export interface Point {
    x: number
    y: number
}

const DENSITY = 0.1
const GENERATE_EPSILON = 0.03
const DELAY_MS = 500

const snowflakes: number[][] = []

const points: boolean[][] = []

const free = (p: Point) => {
    return !(points[p.x] && points[p.x][p.y] && true === points[p.x][p.y])
}

const step = () => {
    // const start = Date.now() * 1000 + new Date().getMilliseconds()
    const start = (new Date()).getMilliseconds()
    for (const i in snowflakes) {
        const pos: Point = {
            x: snowflakes[i][0],
            y: snowflakes[i][1] + 1
        }
        if (free(pos)) {
            points[snowflakes[i][0]][snowflakes[i][1]] = false
            snowflakes[i] = [pos.x, pos.y]
        }
    }
    // const end = Date.now() * 1000 + new Date().getMilliseconds()
    const end = (new Date()).getMilliseconds()
    console.log(end - start)
}

let dim: Dimension

export const init = (dimension: Dimension, notify: (snowflakes: number[][]) => void) => {
    dim = dimension
    for (let i = 0; i < dim.width; ++i) {
        const col: boolean[] = []
        for (let j = 0;  j < dim.height; ++j) {
            col.push(false)
        }
        points.push(col)
    }

    setInterval(() => {
        step()
        pump()
        notify(snowflakes)
    }, DELAY_MS)
}

const pump = () => {
    const rnd = (random() * 2 - 1) * GENERATE_EPSILON
    const generateNum = round(dim.width * (DENSITY + rnd))
    for (let i = 0; i < generateNum; ++i) {
        let x: number
        do {
            x = round(random() * dim.width)
        } while (!free({ x, y: 0 }))
        snowflakes.push([
            x, 0
        ])
        points[x][0] = true
    }
}
