class BaseError extends Error {}

// TODO: Use this template to apply to Auth Error, Bad Requests, etc.
export class CharacterCountExceeded extends Error {
  type: string
  statusCode: number

  // parent error
  constructor(post_id, content, ...params) {
    super(...params)
    this.name = this.constructor.name // good practice

    if (this instanceof LongTitleError)
      // checking if title or body
      this.type = 'title'
    else if (this instanceof LongBodyError) this.type = 'body'

    this.message = `The character count of post (id: ${post_id}) ${this.type} is too long. (${content.length} characters)` // detailed error message
    this.statusCode = 500 // error code for responding to client
  }
}

export class LongTitleError extends CharacterCountExceeded {}
export class LongBodyError extends CharacterCountExceeded {}
