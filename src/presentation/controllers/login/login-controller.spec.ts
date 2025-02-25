import { MissingParamError } from "../../errors"
import { badRequest, ok, serverError, unauthorized } from "../../helpers/http/http-helper"
import { HttRequest, Authentication, Validation, AuthenticationModel } from "./login-controller-protocols"
import { LoginController } from "./login-controller"
const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: AuthenticationModel): Promise<string> {
      return new Promise(resolve => resolve('any_token'))
    }
  }
  return new AuthenticationStub()
}
const makeValidation = (): Validation => {
  class ValidationStub implements Validation { // o termo stub é de email marretado
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}
const makeFakeRequest = (): HttRequest => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password'
  }
})
interface SutTypes {
  sut: LoginController
  authenticationStub: Authentication
  validationStub: Validation
}
const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const authenticationStub = makeAuthentication()
  const sut = new LoginController(authenticationStub, validationStub)
  return {
    sut,
    authenticationStub,
    validationStub
  }
}
describe('Login Controller', () => {
  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    await sut.handle(makeFakeRequest())
    expect(authSpy).toHaveBeenCalledWith({
      email: 'any_email@mail.com',
      password:
'any_password'
    })
  })
  test('Should return 401 if invalid credencials are provided', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise(resolve =>
      resolve(null)))
    const httpREsponse = await sut.handle(makeFakeRequest())
    expect(httpREsponse).toEqual(unauthorized())
  })
  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise((resolve, reject) =>
      reject(new Error())))
    const httpREsponse = await sut.handle(makeFakeRequest())
    expect(httpREsponse).toEqual(serverError(new Error()))
  })
  test('Should return 401 if invalid credencials are provided', async () => {
    const { sut } = makeSut()
    const httpREsponse = await sut.handle(makeFakeRequest())
    expect(httpREsponse).toEqual(ok({ accessToken: 'any_token' }))
  })
  test('Shoud call AddAccount with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })
  test('Shoud return 400 if validation retrns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new
    MissingParamError('any_field'))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })
})
