import { identicon, pixelArt, shapes } from '@dicebear/collection'
import { createAvatar } from '@dicebear/core'

export const styles = {
  pixelArt: pixelArt,
  identicon: identicon,
  shapes: shapes,
}

export default (seed: string, type: 'pixelArt' | 'identicon' | 'shapes') => {
  return createAvatar(styles[type], { seed }).toJson()
}
