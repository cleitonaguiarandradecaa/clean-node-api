import { HttpResponse, HttRequest } from "./http"
export interface Controller {
  handle (httRequest: HttRequest): Promise<HttpResponse | undefined>
}
