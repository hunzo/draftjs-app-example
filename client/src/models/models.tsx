export interface UserSession {
  username: string
  token: string
}

export interface AttachementFile {
  file_name: string
  file_size: number
  file_type: string
  file_bytes?: string
  file_content_base64?: string
  width?: number
  alignment?: string
  cid: string
  preview_url: string
}

export interface MailAttachfile {
  file_name: string
  file_content_type: string
  file_bytes: string
  isInline?: boolean
  content_id?: string
}

export interface MailPayload {
  subject: string
  content_html: string
  to_recipient_list: string[]
  cc_recipient_list?: string[]
  attach_files?: MailAttachfile[]
}
