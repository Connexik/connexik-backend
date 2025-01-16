import prisma from '../connection/data-source';

export const createLinkedInFiltersRequest = async (
  linkedInUserId: number,
  action: string,
  type: string,
  filters: string[]
): Promise<number> => {
  const request = await prisma.linkedInFiltersRequest.create({
    data: {
      linkedInUserId,
      action,
      type,
      filters
    },
    select: {
      id: true
    }
  });

  return request?.id;
};
