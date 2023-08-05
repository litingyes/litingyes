import type { StarOptions } from './star'
import { Star } from './star'

export interface StarsOptions {
  container: HTMLElement
  count?: number
  speed?: number
  direction?: 'TOP' | 'BOTTOM' | 'LEFT' | 'RIGHT'
  position?: {
    horizontal: [number, number]
    vertical: [number, number]
  }
  starSizeRange?: [number, number]
  starOptions?: StarOptions
}

export class Stars {
  container: HTMLElement
  count: number
  speed: number
  direction: 'TOP' | 'BOTTOM' | 'LEFT' | 'RIGHT'
  position: {
    horizontal: [number, number]
    vertical: [number, number]
  }

  starSizeRange: [number, number]
  starOptions: StarOptions
  stars: Star[] = []
  intervalID: NodeJS.Timer | null = null

  constructor(options: StarsOptions) {
    this.container = options.container
    this.count = options?.count ?? 10
    this.speed = options?.speed ?? 0
    this.direction = options?.direction ?? 'TOP'
    this.position = options?.position ?? {
      horizontal: [0, 1],
      vertical: [0, 1],
    }
    this.starSizeRange = options.starSizeRange ?? [2, 6]
    this.starOptions = options.starOptions ?? {}
  }

  initLeft() {
    return `${Math.round((Math.random() * (this.position.horizontal[1] - this.position.horizontal[0]) + this.position.horizontal[0]) * 100)}%`
  }

  initTop() {
    return `${Math.round((Math.random() * (this.position.vertical[1] - this.position.vertical[0]) + this.position.vertical[0]) * 100)}%`
  }

  initSize() {
    return Math.round(Math.random() * (this.starSizeRange[1] - this.starSizeRange[0]) + this.starSizeRange[0])
  }

  initSpeed(size: number) {
    const sizeDistance = this.starSizeRange[1] - this.starSizeRange[0]
    const sizeMid = Math.round(sizeDistance / 2) + this.starSizeRange[0]
    if (size > sizeMid)
      return this.speed * (1 + (size - sizeMid) / sizeDistance)

    else
      return this.speed * (1 - (sizeMid - size) / sizeDistance)
  }

  initStars() {
    for (let i = 0; i < this.count; i++) {
      let left = ''
      let top = ''
      left = this.initLeft()
      top = this.initTop()
      if (this.speed !== 0) {
        if (this.direction === 'TOP')
          top = '100%'

        else if (this.direction === 'BOTTOM')
          top = '0%'

        else if (this.direction === 'LEFT')
          left = '0%'

        else
          left = '100%'
      }

      const size = this.initSize()
      const speed = this.initSpeed(size)

      const customStyle = { left, top, ...this.starOptions.customStyle }
      const star = new Star({ width: `${size}px`, height: `${size}px`, speed, ...this.starOptions, customStyle })
      star.insert(this.container)
      this.stars.push(star)
    }
  }

  init() {
    if (this.count < 0)
      this.count = 10

    if (this.speed < 0)
      this.speed = 0

    else if (this.speed > 1)
      this.speed = 1

    if (this.position.horizontal[0] < 0)
      this.position.horizontal[0] = 0

    else if (this.position.horizontal[0] > 1)
      this.position.horizontal[0] = 1

    if (this.position.horizontal[1] < 0)
      this.position.horizontal[1] = 0

    else if (this.position.horizontal[1] > 1)
      this.position.horizontal[1] = 1

    if (this.position.horizontal[0] > this.position.horizontal[1])
      [this.position.horizontal[0], this.position.horizontal[1]] = [this.position.horizontal[1], this.position.horizontal[0]]

    if (this.position.vertical[0] < 0)
      this.position.vertical[0] = 0

    else if (this.position.vertical[0] > 1)
      this.position.vertical[0] = 1

    if (this.position.vertical[0] < 0)
      this.position.vertical[0] = 0

    else if (this.position.vertical[0] > 1)
      this.position.vertical[0] = 1

    if (this.position.vertical[0] > this.position.vertical[1])
      [this.position.vertical[0], this.position.vertical[1]] = [this.position.vertical[1], this.position.vertical[0]]

    if (this.starSizeRange[0] < 0)
      this.starSizeRange[0] = 0

    if (this.starSizeRange[1] < 0)
      this.starSizeRange[1] = 0

    if (this.starSizeRange[0] > this.starSizeRange[1])
      [this.starSizeRange[0], this.starSizeRange[1]] = [this.starSizeRange[1], this.starSizeRange[0]]

    if (getComputedStyle(this.container).position === 'static')
      this.container.style.position = 'relative'

    requestAnimationFrame(() => {
      this.initStars()
    })
  }

  start() {
    if (this.speed === 0)
      return
    this.intervalID = setInterval(() => {
      requestAnimationFrame(() => {
        const containerStyle = getComputedStyle(this.container)
        const containerWidth = Number.parseInt(containerStyle.width)
        const containerHeight = Number.parseInt(containerStyle.height)

        this.stars.forEach((star) => {
          const size = Number.parseInt(star.width)

          switch (this.direction) {
            case 'TOP': {
              let top = Number.parseFloat(star.element.style.top)
              top = top - star.speed * 100

              if ((top / 100) < -(size / containerHeight)) {
                top = 100
                const left = this.initLeft()
                const size = this.initSize()
                const speed = this.initSpeed(size)
                star.updateOptions({ width: `${size}px`, height: `${size}px`, speed, customStyle: { top: `${top}%`, left } })
              }
              else {
                star.updateOptions({ customStyle: { top: `${top}%` } })
              }
              break
            }

            case 'BOTTOM': {
              let top = Number.parseFloat(star.element.style.top)
              top = top + star.speed * 100

              if (top > 100) {
                top = 0
                const left = this.initLeft()
                const size = this.initSize()
                const speed = this.initSpeed(size)
                star.updateOptions({ width: `${size}px`, height: `${size}px`, speed, customStyle: { top: `${top}%`, left } })
              }
              else {
                star.updateOptions({ customStyle: { top: `${top}%` } })
              }
              break
            }

            case 'LEFT': {
              let left = Number.parseFloat(star.element.style.left)
              left = left - star.speed * 100

              if ((left / 100) < -(size / containerWidth)) {
                left = 100
                const top = this.initTop()
                const size = this.initSize()
                const speed = this.initSpeed(size)
                star.updateOptions({ width: `${size}px`, height: `${size}px`, speed, customStyle: { left: `${left}%`, top } })
              }
              else {
                star.updateOptions({ customStyle: { left: `${left}%` } })
              }
              break
            }

            case 'RIGHT': {
              let left = Number.parseFloat(star.element.style.left)
              left = left + star.speed * 100
              if (left > 100) {
                left = 0
                const top = this.initTop()
                const size = this.initSize()
                const speed = this.initSpeed(size)
                star.updateOptions({ width: `${size}px`, height: `${size}px`, speed, customStyle: { left: `${left}%`, top } })
              }
              else {
                star.updateOptions({ customStyle: { left: `${left}%` } })
              }
              break
            }
          }
        })
      })
    }, 100 / 6)
  }

  stop() {
    if (this.intervalID) {
      clearInterval(this.intervalID)
      this.intervalID = null
    }
  }

  continue() {
    this.start()
  }

  dispose() {
    this.stop()
    requestAnimationFrame(() => {
      this.stars.forEach(star => star.remove())
    })
  }
}
