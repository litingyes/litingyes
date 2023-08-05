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
      const size = this.initSize(label)
      const speed = this.initSpeed(size)

      let left = ''
      let top = ''
      left = this.initLeft()
      top = this.initTop()
      if (this.speed !== 0) {
        if (this.direction === 'BT')
          top = '100%'

        else if (this.direction === 'TB')
          top = `-${size}%`

        else if (this.direction === 'RL')
          left = `-${size}%`

        else
          left = '100%'
      }

      const customStyle = { left, top, fontSize: '12px', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', ...this.starOptions.customStyle } as Partial<CSSStyleDeclaration>
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
        const containerStyle = getComputedStyle(this.container)
        const containerWidth = Number.parseInt(containerStyle.width)
        const containerHeight = Number.parseInt(containerStyle.height)

        this.stars.forEach((star) => {
          if (star.customData?.fixed)
            return

          const size = Number.parseInt(star.width)

          switch (this.direction) {
            case 'BT': {
              let top = Number.parseFloat(star.element.style.top)
              top = top - star.speed * 100

              if ((top / 100) < -(size / containerHeight)) {
                top = 100
                const left = this.initLeft()
                const speed = this.initSpeed(size)
                star.updateOptions({ speed, customStyle: { top: `${top}%`, left } })
              }
              else {
                star.updateOptions({ customStyle: { top: `${top}%` } })
              }
              break
            }

            case 'TB': {
              let top = Number.parseFloat(star.element.style.top)
              top = top + star.speed * 100

              if (top > 100) {
                top = -(size / containerHeight)
                const left = this.initLeft()
                const speed = this.initSpeed(size)
                star.updateOptions({ width: `${size}px`, height: `${size}px`, speed, customStyle: { top: `${top}%`, left } })
              }
              else {
                star.updateOptions({ customStyle: { top: `${top}%` } })
              }
              break
            }

            case 'RL': {
              let left = Number.parseFloat(star.element.style.left)
              left = left - star.speed * 100

              if ((left / 100) < -(size / containerWidth)) {
                const top = this.initTop()
                const speed = this.initSpeed(size)
                left = 100
                star.updateOptions({ width: `${size}px`, height: `${size}px`, speed, customStyle: { left: `${left}%`, top } })
              }
              else {
                star.updateOptions({ customStyle: { left: `${left}%` } })
              }
              break
            }

            case 'LR': {
              let left = Number.parseFloat(star.element.style.left)
              left = left + star.speed * 100

              if (left > 100) {
                left = -(size / containerWidth)
                const top = this.initTop()
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
