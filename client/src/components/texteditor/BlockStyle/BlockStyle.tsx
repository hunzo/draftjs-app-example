import { ContentBlock } from 'draft-js'

export const myBlockStyle = (contentBlock: ContentBlock) => {
  const type = contentBlock.getType()

  switch (type) {
    case 'blockquote':
      return 'style-blockquote'
    case 'text-align-center':
      return 'align-center'
    case 'text-align-left':
      return 'align-left'
    case 'text-align-right':
      return 'align-right'

    default:
      return ''
  }
}
