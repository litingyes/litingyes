import { Stars } from './stars'
import { Star } from './star'
import type { StarsOptions } from './stars'
import { isString } from './utils'

interface BubblesOptionsLabel {
  text: string
  priority: number
}

interface BubblesOptions extends StarsOptions {
  labels: string[] | BubblesOptionsLabel[]
}

export class Bubbles extends Stars {
  labels: BubblesOptionsLabel[]
  count: number
  priorityRange: [number, number] = [-1, -1]

  constructor(options: BubblesOptions) {
    super(options)

    const labels = options.labels ?? [{
      text: 'Bubble',
      priority: 0,
    }]
    this.labels = labels.map((item) => {
      const label = {
        text: 'Bubble',
        priority: 0,
      }

      if (isString(item)) {
        label.text = item as string
      }
      else {
        label.text = (item as BubblesOptionsLabel).text ?? 'Bubble'
        label.priority = (item as BubblesOptionsLabel).priority ?? 0

        if (label.priority < 0)
          label.priority = 0
      }

      if (this.priorityRange[0] < 0 || this.priorityRange[0] > label.priority)
        this.priorityRange[0] = label.priority
      if (this.priorityRange[1] < 0 || this.priorityRange[1] < label.priority)
        this.priorityRange[1] = label.priority

      return label
    })

    this.count = options?.labels?.length ?? 0
  }

  // @ts-expect-error Type '(label: BubblesOptionsLabel) => number' is not assignable to type '() => number'
  initSize(label: BubblesOptionsLabel) {
    if (label.priority === this.priorityRange[0])
      return this.starSizeRange[0]
    return Math.round(this.starSizeRange[0] + (this.starSizeRange[1] - this.starSizeRange[0]) * ((label.priority - this.priorityRange[0]) / (this.priorityRange[1] - this.priorityRange[0])))
  }

  initStars() {
    this.labels.forEach((label) => {
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

      const size = this.initSize(label)
      const speed = this.initSpeed(size)

      const customStyle = { left, top, fontSize: '12px', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: '100', ...this.starOptions.customStyle } as Partial<CSSStyleDeclaration>
      const star = new Star({ width: `${size}px`, height: `${size}px`, text: label.text, speed, ...this.starOptions, customStyle, customData: { fixed: false } })
      star.element.setAttribute('title', label.text)
      star.element.addEventListener('mouseenter', () => {
        this.toggleStarFixed(star)
      })
      star.element.addEventListener('mouseleave', () => {
        this.toggleStarFixed(star)
      })
      star.insert(this.container)
      this.stars.push(star)
    })
  }

  start() {
    if (this.speed === 0)
      return
    this.intervalID = setInterval(() => {
      requestAnimationFrame(() => {
        this.stars.forEach((star) => {
          if (star.customData?.fixed)
            return
          switch (this.direction) {
            case 'TOP': {
              let top = Number.parseFloat(star.element.style.top)
              top = top - star.speed * 100
              if (top < 0) {
                top = 100
                const left = this.initLeft()
                const size = Number.parseInt(star.width)
                const speed = this.initSpeed(size)
                star.updateOptions({ speed, customStyle: { top: `${top}%`, left } })
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
                const size = Number.parseInt(star.width)
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
                const size = Number.parseInt(star.width)
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
                const size = Number.parseInt(star.width)
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

  toggleStarFixed(star: Star) {
    star.customData!.fixed = !star.customData?.fixed
  }
}
