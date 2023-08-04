import { Stars } from './stars'
import { Bubbles } from './bubbles'

const containerLeft = document.getElementById('left')
const stars = new Stars({
  container: containerLeft!,
  speed: 0.001,
  starOptions: {
    backgroundColor: '#94a3b8',
    customStyle: {
      borderRadius: '50%',
    },
  },
})
stars.init()
stars.start()

const containerRight = document.getElementById('right')
const bubbles = new Bubbles({
  container: containerRight!,
  speed: 0.001,
  starSizeRange: [36, 48],
  starOptions: {
    customStyle: {
      borderRadius: '50%',
    },
    customClass: 'bubble-item',
  },
  labels: [
    {
      text: '脱单',
      priority: 10,
    },
    {
      text: '暴富',
      priority: 8,
    },
    {
      text: '健康',
      priority: 6,
    },
  ],
})
bubbles.init()
bubbles.start()
