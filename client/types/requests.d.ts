type TLoginRequest = {
  email: string
  password: string
  captchaToken: string
}

type TSignupRequest = {
  firstName: string
  lastName: string
  username: string
  email: string
  phone: string
  password: string
  passwordConfirm: string
  dateOfBirth: string
  captchaToken: string
}
