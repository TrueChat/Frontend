export type Headers = {
  [key: string]: string
}

export type Request = {
  method: "GET"|"POST"|"PUT"|"PATCH"|"DELETE",
  url: string,
  headers?: Headers,
  body?: any
}


export type Response<T = any> = {
  data: T,
  status: number,
  headers: Headerss
}

export type ResponseHandler<T = any> = (response: Response<T>) => void;

export type ConstraintViolation = {
  property: string,
  violates: boolean,
  message: string
};