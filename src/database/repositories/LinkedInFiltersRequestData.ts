import prisma from '../connection/data-source';
import { type CreateLinkedInFiltersRequestData } from '@/resources/connection.resource';

export const createBatchLinkedInFiltersRequestData = async (
  data: CreateLinkedInFiltersRequestData[]
): Promise<void> => {
  await prisma.linkedInFiltersRequestData.createMany({
    data
  });
};
