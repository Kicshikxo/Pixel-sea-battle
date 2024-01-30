import { createAvatar } from '@dicebear/core'
import { pixelArt, identicon, shapes } from '@dicebear/collection'

export const styles = {
  pixelArt: pixelArt,
  identicon: identicon,
  shapes: shapes,
}

export default (seed: string, type: 'pixelArt' | 'identicon' | 'shapes') => {
  return createAvatar(styles[type], { seed }).toJson()
}
