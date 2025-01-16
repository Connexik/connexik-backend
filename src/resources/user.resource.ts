import { z } from 'zod';

export interface GetLinkedInUser {
  identifier: number
  connexikId: string
  isScanned: boolean
  isLoggedIn: boolean
  rescanTs: string
}

export interface BasicLinkedInUser {
  id: number
  identifier: number
  username: string
  uuid: string
  lastScannedAt: Date
}

export const LinkedInUserDataDetailSchema = z.object({
  location: z.object({
    city: z.string(),
    state: z.string(),
    country: z.string()
  }),
  summary: z.string(),
  experience: z.array(
    z.object({
      company: z.string(),
      title: z.string(),
      years: z.string(),
      location: z.string()
    })
  ),
  education: z.array(
    z.object({
      school: z.string(),
      degree: z.string(),
      years: z.string()
    })
  ),
  skills: z.array(z.string()),
  recommendations: z.array(
    z.object({
      name: z.string(),
      title: z.string(),
      text: z.string()
    })
  ).optional(),
  interests: z.array(
    z.object({
      name: z.string().optional(),
      title: z.string().optional(),
      company: z.string().optional(),
      group: z.string().optional(),
      newsletter: z.string().optional(),
      school: z.string().optional()
    })
  ).optional()
});

export type LinkedInUserDataDetail = z.infer<typeof LinkedInUserDataDetailSchema>;

export const GetLinkedInUserDataSchema = LinkedInUserDataDetailSchema.extend({
  linkedInUserId: z.number()
})
export type GetLinkedInUserData = z.infer<typeof GetLinkedInUserDataSchema>;

export type PartialGetLinkedInUserData = Partial<GetLinkedInUserData>;
