import * as z from "zod";
import { CompleteVehicle, RelatedVehicleModel, CompleteJobs, RelatedJobsModel } from "./index";

export const ClientModel = z.object({
  id: z.string(),
  firstName: z.string().nullish(),
  lastName: z.string().nullish(),
  phone: z.string().nullish(),
  address: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export interface CompleteClient extends z.infer<typeof ClientModel>
{
  vehicles: CompleteVehicle[];
  jobs: CompleteJobs[];
}

/**
 * RelatedClientModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedClientModel: z.ZodSchema<CompleteClient> = z.lazy(() => ClientModel.extend({
  vehicles: RelatedVehicleModel.array(),
  jobs: RelatedJobsModel.array(),
}));
