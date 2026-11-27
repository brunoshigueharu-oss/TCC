import { z } from "zod";

import { ORB_STAGE_COUNT, ORB_STAGE_IDS } from "@/lib/orb/orb-timeline";

/** Legendas do render 3D (página `/orbe`), na ordem da transformação. */

const orbStageSchema = z.object({
  id: z.enum(ORB_STAGE_IDS),
  name: z.string(),
});

const orbDataSchema = z.object({
  hint: z.string(),
  stages: z.array(orbStageSchema).length(ORB_STAGE_COUNT),
});

export type OrbStage = z.infer<typeof orbStageSchema>;
export type OrbData = z.infer<typeof orbDataSchema>;

export const orbData: OrbData = orbDataSchema.parse({
  hint: "Role para transformar",
  stages: [
    { id: "gude", name: "Bolinha de gude" },
    { id: "bolha", name: "Bolha de sabão" },
    { id: "bussola", name: "Bússola" },
    { id: "bola-8", name: "Bola 8" },
    { id: "bola-de-tenis", name: "Bola de tênis" },
  ],
});
