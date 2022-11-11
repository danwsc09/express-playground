export interface BasicPost {
  title: string
  content: string
}

export interface Post extends BasicPost {
  id: number
  author_id: number
  create_date: Date
  update_date: Date
}
