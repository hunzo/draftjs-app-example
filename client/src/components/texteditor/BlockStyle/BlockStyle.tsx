import { ContentBlock } from 'draft-js'

export const myBlockStyle = (contentBlock: ContentBlock) => {
  const type = contentBlock.getType()
  switch (type) {
    case 'blockquote':
      return 'style-blockquote'
    default:
      return null
  }
}
