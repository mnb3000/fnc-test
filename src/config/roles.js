const roles = ['user', 'admin'];

const roleRights = new Map();
roleRights.set(roles[0], ['getUsers', 'getHealthServices', 'getDoctors', 'getClinics']);
roleRights.set(roles[1], [
  'getUsers',
  'manageUsers',
  'getHealthServices',
  'manageHealthServices',
  'getDoctors',
  'manageDoctors',
  'getClinics',
  'manageClinics',
]);

module.exports = {
  roles,
  roleRights,
};
