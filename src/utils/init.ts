import { Stars } from './stars'

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
stars.init()
stars.start()
