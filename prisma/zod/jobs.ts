import * as z from "zod"
import * as imports from "../null"
import { CompleteItems, RelatedItemsModel, CompleteClient, RelatedClientModel, CompleteVehicle, RelatedVehicleModel } from "./index"

export const JobsModel = z.object({
  id: z.string(),
  worker: z.string().nullish(),
  task: z.string().nullish(),
  price: z.string().nullish(),
  status: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
  clientId: z.string().nullish(),
  vehicleId: z.string().nullish(),
})

export interface CompleteJobs extends z.infer<typeof JobsModel> {
  items: CompleteItems[]
  client?: CompleteClient | null
  vehicle?: CompleteVehicle | null
}

/**
 * RelatedJobsModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedJobsModel: z.ZodSchema<CompleteJobs> = z.lazy(() => JobsModel.extend({
  items: RelatedItemsModel.array(),
  client: RelatedClientModel.nullish(),
  vehicle: RelatedVehicleModel.nullish(),
}))
