import * as z from "zod"
import * as imports from "../null"
import { CompleteClient, RelatedClientModel, CompleteJobs, RelatedJobsModel } from "./index"

export const VehicleModel = z.object({
  id: z.string(),
  registrationNumber: z.string().nullish(),
  yearOfManufacture: z.number().int().nullish(),
  model: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
  clientId: z.string().nullish(),
})

export interface CompleteVehicle extends z.infer<typeof VehicleModel> {
  client?: CompleteClient | null
  jobs: CompleteJobs[]
}

/**
 * RelatedVehicleModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedVehicleModel: z.ZodSchema<CompleteVehicle> = z.lazy(() => VehicleModel.extend({
  client: RelatedClientModel.nullish(),
  jobs: RelatedJobsModel.array(),
}))
