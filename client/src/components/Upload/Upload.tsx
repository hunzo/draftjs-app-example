import { AtomicBlockUtils, EditorState } from 'draft-js'
import React, { ChangeEvent } from 'react'
import { useEditor } from '../../context/editorProvider'
import { useSession } from '../../context/SessionProvider'
import { AttachementFile } from '../../models/models'
import { UploadAttachement } from '../../services/Api'
import './Upload.css'

const Upload: React.FC = () => {
  const { editorState, setEditorState } = useEditor()
  const { attachements, setAttachements } = useSession()

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return

    const file = e.target.files![0]
    const reader = new FileReader()
    const formData = new FormData()
    formData.append('file', file)

    reader.onload = () => {
      UploadAttachement(formData)
        .then((rs: any) => {
          const uploadImage: AttachementFile = {
            file_name: file.name,
            file_type: file.type,
            file_size: file.size,
            file_content_base64: reader.result as string,
            file_bytes: (reader.result as string).split(
              `data:${file.type};base64,`
            )[1],
            cid: rs.data.cid,
            preview_url: rs.data.file_url,
          }

          setAttachements([...attachements, uploadImage])

          const previewImage: AttachementFile = {
            file_name: file.name,
            file_type: file.type,
            file_size: file.size,
            preview_url: rs.data.file_url,
            width: 450,
            alignment: 'center',
            cid: rs.data.cid,
          }

          const constentStateWithEntity = editorState
            .getCurrentContent()
            .createEntity('image:file', 'IMMUTABLE', previewImage)

          setEditorState(
            AtomicBlockUtils.insertAtomicBlock(
              EditorState.set(editorState, {
                currentContent: constentStateWithEntity,
              }),
              constentStateWithEntity.getLastCreatedEntityKey(),
              ' '
            )
          )
        })
        .catch((err) => {
          alert(err)
        })
    }

    reader.readAsDataURL(e.target.files[0])

    e.target.value = ''
  }

  return (
    <>
      <input
        id="upload"
        type="file"
        style={{ display: 'none' }}
        accept="image/png,image/jpeg,image/jpg,image/gif"
        onChange={handleUpload}
      />
      <button
        onClick={(e: React.MouseEvent) => {
          e.preventDefault()
          document.getElementById('upload')?.click()
        }}
      >
        Upload Photo
      </button>
    </>
  )
}

export default Upload
