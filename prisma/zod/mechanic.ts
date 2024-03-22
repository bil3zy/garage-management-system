import * as z from "zod"
import { CompleteJobs, RelatedJobsModel, CompleteGarage, RelatedGarageModel } from "./index"

export const MechanicModel = z.object({
  id: z.string(),
  name: z.string().nullish(),
  percentage: z.number().int().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
  garageId: z.string().nullish(),
})

export interface CompleteMechanic extends z.infer<typeof MechanicModel> {
  jobs: CompleteJobs[]
  garage?: CompleteGarage | null
}

/**
 * RelatedMechanicModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedMechanicModel: z.ZodSchema<CompleteMechanic> = z.lazy(() => MechanicModel.extend({
  jobs: RelatedJobsModel.array(),
  garage: RelatedGarageModel.nullish(),
}))
