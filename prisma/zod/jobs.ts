import * as z from "zod"
import { CompleteItems, RelatedItemsModel, CompleteClient, RelatedClientModel, CompleteVehicle, RelatedVehicleModel, CompleteMechanic, RelatedMechanicModel, CompleteGarage, RelatedGarageModel } from "./index"

export const JobsModel = z.object({
  id: z.string(),
  task: z.string().nullish(),
  costOfWork: z.number().int().nullish(),
  status: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
  clientId: z.string().nullish(),
  vehicleId: z.string().nullish(),
  mechanicId: z.string().nullish(),
  garageId: z.string(),
})

export interface CompleteJobs extends z.infer<typeof JobsModel> {
  items: CompleteItems[]
  client?: CompleteClient | null
  vehicle?: CompleteVehicle | null
  mechanic?: CompleteMechanic | null
  garage?: CompleteGarage | null
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
  mechanic: RelatedMechanicModel.nullish(),
  garage: RelatedGarageModel.nullish(),
}))
