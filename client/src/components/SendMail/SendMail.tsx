import { convertToHTML } from 'draft-convert'
import { convertToRaw } from 'draft-js'
import { useEditor } from '../../context/editorProvider'
import { useSession } from '../../context/SessionProvider'

import {
  AttachementFile,
  MailAttachfile,
  MailPayload,
} from '../../models/models'

const SendMail: React.FC = () => {
  const { editorState } = useEditor()
  const { attachements, setAttachements, subject, recipient } = useSession()

  const html = convertToHTML({
    entityToHTML: (entity, text) => {
      if (entity.type === 'image:file') {
        const { cid, alignment, width, file_name } = entity.data
        return (
          <p style={{ textAlign: alignment }}>
            <img src={`cid:${cid}`} alt={file_name} width={width} />
          </p>
        )
      }
      if (entity.type === 'LINK') {
        const { url } = entity.data
        // console.log('convert link')
        return (
          <a rel="noopener noreferrer" target="_blank" href={url}>
            {text}
          </a>
        )
      }
    },
    blockToHTML: (block) => {
      if (block.type === 'unstyled' && block.text.length === 0) {
        return <br />
      }

      if (block.type === 'unstyled') {
        return (
          <p
            style={{
              margin: '1px 0 1px 0',
              padding: '0',
              whiteSpace: 'pre-wrap',
            }}
          />
        )
      }
    },
  })(editorState.getCurrentContent())

  const CreateAttachements = () => {
    // console.log('CreatePayload:', payload)
    const entityMap = convertToRaw(editorState.getCurrentContent()).entityMap
    const mapEntity = new Map(Object.entries(entityMap))
    const Attach: MailAttachfile[] = []
    const temp: AttachementFile[] = [] //clear useLocalStorage

    attachements.forEach((i) => {
      mapEntity.forEach((e) => {
        if (i.cid === e.data.cid) {
          //console.log('hey')
          const AttFiles: MailAttachfile = {
            file_name: e.data.file_name,
            file_content_type: i.file_type,
            file_bytes: i.file_bytes as string,
            isInline: true, // false = show attachements file, true hide attachements file
            content_id: i.cid,
          }
          Attach.push(AttFiles)
          temp.push(i)
        }
      })
    })

    setAttachements(temp) //clear LocalStorage

    console.log(`temp: `, temp)
    console.log(`Upload: `, attachements)
    console.log(`Attach: `, Attach)

    return Attach
  }

  const handleSendMail = () => {
    const payload: MailPayload = {
      subject: subject,
      content_html: html,
      to_recipient_list: recipient,
      attach_files: CreateAttachements(),
    }

    console.log(payload)
    alert(JSON.stringify(payload, null, 2))
  }

  return (
    <button
      onClick={(e) => {
        e.preventDefault()
        handleSendMail()
      }}
    >
      Send
    </button>
  )
}

export default SendMail
