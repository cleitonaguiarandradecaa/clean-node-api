import { LogErrorRepository } from "../../data/protocols/db/log/log-error-repository"
import { Controller, HttpResponse, HttRequest } from "../../presentation/protocols"
export class LogControllerDecorator implements Controller {
  constructor (
    private readonly controller: Controller,
    private readonly logErrorRepository: LogErrorRepository) {}
  async handle (httRequest: HttRequest): Promise<HttpResponse | undefined> {
    const httpResponse = await this.controller.handle(httRequest)
    if (httpResponse.statusCode === 500) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await this.logErrorRepository.logError(httpResponse.body.stack)
    }
    return httpResponse
  }
}
