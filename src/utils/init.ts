import { Stars } from './stars'
import { Bubbles } from './bubbles'

const containerLeft = document.getElementById('left')
const stars = new Stars({
  container: containerLeft!,
  speed: 0.001,
  direction: 'BOTTOM',
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
  position: {
    horizontal: [0.05, 0.95],
  },
  labels: [
    {
      text: '脱单',
      priority: 100,
    },
    {
      text: '健康',
      priority: 90,
    },
    {
      text: '学习',
      priority: 80,
    },
    {
      text: '暴富',
      priority: 70,
    },
  ],
})
bubbles.init()
bubbles.start()
