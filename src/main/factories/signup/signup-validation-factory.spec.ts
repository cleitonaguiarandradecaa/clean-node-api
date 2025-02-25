import { Validation } from "../../../presentation/protocols/validation"
import { RequiredFieldValidation, ValidationComposite, CompareFielsdValidation, EmailValidation } from "../../../presentation/helpers/validators"
import { makeSignUpValidation } from "./signup-validation-factory"
import { EmailValidator } from "../../../presentation/protocols/email-validator"
jest.mock("../../../presentation/helpers/validators/validation-composite")
const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator { // o termo stub é de email marretado
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}
describe('SignUpValidation Factory', () => {
  test('Shoul call ValidationComposite with all validations', () => {
    makeSignUpValidation()
    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new CompareFielsdValidation('password', 'passwordConfirmation'))
    validations.push(new EmailValidation('email', makeEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
