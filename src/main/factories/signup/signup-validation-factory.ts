import { Validation } from '../../../presentation/protocols/validation'
import { RequiredFieldValidation, ValidationComposite, CompareFielsdValidation, EmailValidation } from '../../../presentation/helpers/validators'
import { EmailValidatorApadter } from '../../../main/adapters/validators/email-validator-adapter'
export const makeSignUpValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new CompareFielsdValidation('password', 'passwordConfirmation'))
  validations.push(new EmailValidation('email', new EmailValidatorApadter()))
  return new ValidationComposite(validations)
}
