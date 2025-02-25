import { InvalidParamError } from '../../../presentation/errors'
import { EmailValidator } from '../../protocols/email-validator'
import { EmailValidation } from './email-validation'
const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator { // o termo stub é de email marretado
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}
interface SutTypes {
  sut: EmailValidation
  emailValidatorStub: EmailValidator
}
const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new EmailValidation('email',emailValidatorStub)
  return {
    sut,
    emailValidatorStub
  }
}
describe('Email Validation', () => {
  test('Shoud return an error if EmailValidation returns false', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const error = sut.validate({ email: 'valid_email@mail.com' })
    expect(error).toEqual(new InvalidParamError('email'))
  })
  test('Shoud call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    sut.validate({ email: 'valid_email@mail.com' })
    expect(isValidSpy).toHaveBeenCalledWith('valid_email@mail.com')
  })
  test('Shoud return trow if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(sut.validate).toThrow()
  })
})
