import * as z from "zod"
import { CompleteJobs, RelatedJobsModel, CompleteMechanic, RelatedMechanicModel, CompleteAccount, RelatedAccountModel } from "./index"

export const GarageModel = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteGarage extends z.infer<typeof GarageModel> {
  Jobs: CompleteJobs[]
  Mechanic: CompleteMechanic[]
  Account: CompleteAccount[]
}

/**
 * RelatedGarageModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedGarageModel: z.ZodSchema<CompleteGarage> = z.lazy(() => GarageModel.extend({
  Jobs: RelatedJobsModel.array(),
  Mechanic: RelatedMechanicModel.array(),
  Account: RelatedAccountModel.array(),
}))
