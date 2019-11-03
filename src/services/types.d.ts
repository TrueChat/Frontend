export type Header = {
  [key: string]: string
}

export type Request = {
  method: "GET"|"POST"|"PUT"|"PATCH"|"DELETE",
  url: string,
  headers?: Header[],
  body?: any
}


export type Response<T = any> = {
  data: T,
  status: number,
  headers: Header[]
}