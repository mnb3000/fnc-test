const roles = ['user', 'admin'];

const roleRights = new Map();
roleRights.set(roles[0], ['getUsers', 'manageUsers', 'getHealthServices', 'getDoctors']);
roleRights.set(roles[1], [
  'getUsers',
  'manageUsers',
  'getHealthServices',
  'manageHealthServices',
  'getDoctors',
  'manageDoctors',
]);

module.exports = {
  roles,
  roleRights,
};
