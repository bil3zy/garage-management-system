import * as z from "zod"
import { CompleteJobs, RelatedJobsModel } from "./index"

export const ItemsModel = z.object({
  id: z.string(),
  name: z.string().nullish(),
  broughtBy: z.string().nullish(),
  price: z.number().int().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
  jobId: z.string().nullish(),
})

export interface CompleteItems extends z.infer<typeof ItemsModel> {
  job?: CompleteJobs | null
}

/**
 * RelatedItemsModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedItemsModel: z.ZodSchema<CompleteItems> = z.lazy(() => ItemsModel.extend({
  job: RelatedJobsModel.nullish(),
}))
