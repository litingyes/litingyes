interface StarOptions {
  width?: string
  height?: string
  backgroundColor?: string
  text?: string
  customClass?: string
  customStyle?: Partial<CSSStyleDeclaration>

  speed?: number
}

class Star {
  element: HTMLElement
  width: string
  height: string
  backgroundColor: string
  text: string
  customClass: string
  customStyle: Partial<CSSStyleDeclaration>
  speed: number

  constructor(options: StarOptions) {
    this.element = document?.createElement('div')
    this.element.style.position = 'absolute'

    this.width = options?.width ?? '4px'
    this.height = options?.height ?? '4px'
    this.backgroundColor = options?.backgroundColor ?? 'transparent'
    this.text = options?.text ?? ''
    this.customClass = options.customClass ?? 'star'
    this.customStyle = options.customStyle ?? {}
    this.speed = options.speed ?? 0
    this.update()
  }

  update() {
    for (const [key, val] of Object.entries(this.customStyle))
      // @ts-expect-error Element implicitly has an 'any' type because index expression is not of type 'number'
      this.element.style[key] = val

    this.element.style.width = this.width
    this.element.style.height = this.height
    this.element.style.backgroundColor = this.backgroundColor
    this.element.textContent = this.text
    this.element.classList.add(this.customClass)
  }

  updateOptions(options: StarOptions) {
    if (options.customClass)
      this.element.classList.remove(this.customClass)

    for (const [key, val] of Object.entries(options))
      // @ts-expect-error Element implicitly has an 'any' type because expression of type 'string' can't be used to index type 'Star'
      this[key] = val

    this.update()
  }

  insert(container: HTMLElement) {
    container.appendChild(this.element)
  }

  remove() {
    this.element?.remove()
  }
}

interface StarsOptions {
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

class Stars {
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

    this.init()
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
        this.stars.forEach((star) => {
          switch (this.direction) {
            case 'TOP': {
              let top = Number.parseFloat(star.element.style.top)
              top = top - star.speed * 100
              if (top < 0) {
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
              if (top > 0) {
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
              if (left <= 0) {
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
              if (left >= 100) {
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

  reset() {
    this.stop()

    requestAnimationFrame(() => {
      this.initPosition()
    })
  }

  dispose() {
    this.stop()
    requestAnimationFrame(() => {
      this.stars.forEach(star => star.remove())
    })
  }
}

const container = document.getElementById('left')
const stars = new Stars({
  container: container!,
  speed: 0.001,
  starOptions: {
    backgroundColor: '#94a3b8',
    customStyle: {
      borderRadius: '50%',
    },
  },
})
stars.start()
