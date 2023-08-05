export interface StarOptions {
  width?: string
  height?: string
  backgroundColor?: string
  text?: string
  customClass?: string
  customStyle?: Partial<CSSStyleDeclaration>
  speed?: number
  customData?: Record<string, any>
}

export class Star {
  element: HTMLElement
  width: string
  height: string
  backgroundColor: string
  text: string
  customClass: string
  customStyle: Partial<CSSStyleDeclaration>

  speed: number
  customData: Record<string, any>

  constructor(options: StarOptions) {
    this.element = document?.createElement('div')
    this.element.style.position = 'absolute'

    this.width = options?.width ?? '4px'
    this.height = options?.height ?? '4px'
    this.backgroundColor = options?.backgroundColor ?? 'transparent'
    this.text = options?.text ?? ''
    this.customClass = options.customClass ?? 'star'
    this.customStyle = options?.customStyle ?? {}
    this.speed = options.speed ?? 0
    this.customData = options.customData ?? {}
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
