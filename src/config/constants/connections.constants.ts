export const CONNECTIONS_ACTION = {
  accept: 'accept'
}

export const CONNECTIONS_ACTION_TYPE = {
  basic_details: 'basic_details'
}

export const CONNECTIONS_MAX_THRESHOLD_PER_DAY = {
  [CONNECTIONS_ACTION.accept]: 60
};

export const CONNECTIONS_FILTERS = {
  company: 'Check if the person is working or worked in the same company/experience from experience block.',
  school: 'Check if the person has attented the same school/colledge from education block.',
  mutualConnections: 'Check if the person has some mutual connections so just doesn`t matter any other filter.',
  ai: 'You have the full profile of the mine and some basic info of the user as well tell me if its a good match according to you based on that basic info?'
};

export default {
  CONNECTIONS_ACTION,
  CONNECTIONS_MAX_THRESHOLD_PER_DAY,
  CONNECTIONS_FILTERS
}
