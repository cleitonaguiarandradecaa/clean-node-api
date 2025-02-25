import { Validation } from '../../../presentation/protocols/validation'
import { RequiredFieldValidation, ValidationComposite, EmailValidation } from '../../../presentation/helpers/validators'
import { EmailValidatorApadter } from '../../../main/adapters/validators/email-validator-adapter'
export const makeLoginValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['email', 'password']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new EmailValidation('email', new EmailValidatorApadter()))
  return new ValidationComposite(validations)
}
