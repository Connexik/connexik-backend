import { getAllUserGroups, getGroupByGroupId } from '@database/repositories/GroupsRepository';
import { type GroupResponse } from '@database/interface';
import { createNewGroup } from '@services/helper.service';

const getGroups = async (userId: number, page: number, limit: number): Promise<GroupResponse | GroupResponse[]> => {
  return await getAllUserGroups(userId, { page, limit });
};

const createGroup = async (userId: number, otherUser: number): Promise<GroupResponse | GroupResponse[]> => {
  const group = await createNewGroup(userId, otherUser)
  return await getGroupByGroupId(Number(group.id), userId);
};

const getGroupStatus = async (userId: number, groupId: number): Promise<GroupResponse | GroupResponse[]> => {
  return await getGroupByGroupId(groupId, userId);
};

const updateGroupStatus = async (userId: number, groupId: number): Promise<GroupResponse | GroupResponse[]> => {
  return await getGroupByGroupId(groupId, userId);
};

export default {
  getGroups,
  createGroup,
  getGroupStatus,
  updateGroupStatus
};
