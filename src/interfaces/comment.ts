export interface BasicComment {
  post_id: number
  content: string
}

export interface Comment extends BasicComment {
  id: number
  author_id: number
  create_date: Date
  update_date: Date
}
