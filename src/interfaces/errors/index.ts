interface ErrorParams {
  statusCode?: number
  message?: string
}

export class BaseError extends Error {
  statusCode: number
  message: string

  constructor(
    { statusCode = 500, message = 'Internal Server Error' }: ErrorParams,
    ...params
  ) {
    super(...params)
    this.name = this.constructor.name
    this.statusCode = statusCode
    this.message = message
  }
}

export class UnauthorizedError extends BaseError {
  constructor(message = 'You must be logged in to continue', ...params) {
    super({ statusCode: 401, message }, ...params)
  }
}

export class InvalidArgumentError extends BaseError {
  constructor(...params) {
    super({ statusCode: 400, message: 'Invalid argument(s).' }, ...params)
  }
}

// TODO: Use this template to apply to Auth Error, Bad Requests, etc.
// export class CharacterCountExceeded extends Error {
//   type: string
//   statusCode: number

//   // parent error
//   constructor(post_id, content, ...params) {
//     super(...params)
//     this.name = this.constructor.name // good practice

//     if (this instanceof LongTitleError)
//       // checking if title or body
//       this.type = 'title'
//     else if (this instanceof LongBodyError) this.type = 'body'

//     this.message = `The character count of post (id: ${post_id}) ${this.type} is too long. (${content.length} characters)` // detailed error message
//     this.statusCode = 500 // error code for responding to client
//   }
// }
