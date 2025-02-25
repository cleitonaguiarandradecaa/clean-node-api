import { EmailValidatorApadter } from "./email-validator-adapter"
import validator from 'validator'
jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))
const makeSut = (): EmailValidatorApadter => {
  return new EmailValidatorApadter()
}
describe('EmailValidator Adapter', () => {
  test('Should return false is validator returns false', () => {
    const sut = makeSut()
    jest.spyOn(validator,'isEmail').mockReturnValueOnce(false)
    const isValid = sut.isValid('invalid_mail@mail.com')
    expect(isValid).toBe(false)
  })
  test('Should return true is validator returns true', () => {
    const sut = makeSut()
    const isValid = sut.isValid('invalid_mail@mail.com')
    expect(isValid).toBe(true)
  })
  test('Should return true is validator returns true', () => {
    const sut = makeSut()
    const isEmailSpy = jest.spyOn(validator, 'isEmail')
    sut.isValid('invalid_mail@mail.com')
    expect(isEmailSpy).toHaveBeenCalledWith('invalid_mail@mail.com')
  })
})
