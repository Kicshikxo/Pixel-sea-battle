import { identicon, pixelArt, shapes } from '@dicebear/collection'
import { createAvatar } from '@dicebear/core'

export const styles = {
  identicon: identicon,
  pixelArt: pixelArt,
  shapes: shapes,
}

export default (seed: string, style: keyof typeof styles, scale: number = 100) => {
  return createAvatar(styles[style], { seed, scale }).toJson()
}
