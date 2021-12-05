import { useState } from 'react'
import { useSession } from '../../context/SessionProvider'
import Modal from 'react-modal'
import './SubjectRecipient.css'
const SubjectRecipient: React.FC = () => {
  const { subject, setSubject, recipient, setReipient } = useSession()
  const [subj, setSubj] = useState('')
  const [recpt, setRcpt] = useState('')
  const [modal, setModal] = useState(false)

  return (
    <>
      <button onClick={() => setModal(true)}>add Subject and Recipient</button>
      <Modal
        isOpen={modal}
        ariaHideApp={false}
        overlayClassName="Overlay"
        className="Modal"
      >
        <button onClick={() => setModal(false)}>close</button>

        <div className="subject-container">
          <div className="subject-box">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (subj === '') return
                setSubject(subj)
                setSubj('')
              }}
            >
              <input
                type="text"
                onChange={(e) => {
                  e.preventDefault()
                  setSubj(e.target.value)
                }}
                value={subj}
              />
              <button type="submit">add subject</button>
            </form>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (recpt === '') return
                setReipient([...recipient, recpt])
                setRcpt('')
              }}
            >
              <input
                type="text"
                onChange={(e) => {
                  e.preventDefault()
                  setRcpt(e.target.value)
                }}
                value={recpt}
              />
              <button type="submit">add recipient</button>
            </form>
            <button
              onClick={(e) => {
                e.preventDefault()
                setReipient([])
              }}
              style={{ marginRight: '4px' }}
            >
              clear recipient list
            </button>
            <button
              onClick={(e) => {
                e.preventDefault()
                setSubject('')
              }}
            >
              clear subject
            </button>

            <p>
              <span>subject : {subject}</span>
            </p>
            <div>
              <span>recipient list :</span>
              <pre>{JSON.stringify(recipient, null, 2)}</pre>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default SubjectRecipient
