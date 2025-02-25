import { HttpResponse, HttRequest, Controller, AddAccount, Validation } from "./signup-protocols-controller"
import { badRequest, ok, serverError } from "../../helpers/http/http-helper"
export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation) {}
  async handle (httRequest: HttRequest): Promise<HttpResponse | undefined> {
    //  https:// bobbyhadz.com/blog/typescript-function-lacks-ending-return-statement
    try {
      const error = this.validation.validate(httRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { name, email, password } = httRequest.body
      const account = await this.addAccount.add({
        name,
        email,
        password
      })
      return ok(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
