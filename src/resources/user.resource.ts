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
  ).optional().nullable(),
  interests: z.array(
    z.object({
      name: z.string().optional().nullable(),
      title: z.string().optional().nullable(),
      company: z.string().optional().nullable(),
      group: z.string().optional().nullable(),
      newsletter: z.string().optional().nullable(),
      school: z.string().optional().nullable()
    })
  ).optional().nullable()
});

export type LinkedInUserDataDetail = z.infer<typeof LinkedInUserDataDetailSchema>;

export const GetLinkedInUserDataSchema = LinkedInUserDataDetailSchema.extend({
  linkedInUserId: z.number()
})
export type GetLinkedInUserData = z.infer<typeof GetLinkedInUserDataSchema>;

export type PartialGetLinkedInUserData = Partial<GetLinkedInUserData>;
