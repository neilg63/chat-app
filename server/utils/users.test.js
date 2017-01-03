const expect = require('expect');

const {Users} = require('./users');

describe('Users', () => {

	var users;
	beforeEach(() => {
		users = new Users();
		users.users = [{
			id: 1,
			name: "Julie",
			room: "Node Course"
		},{
			id: 2,
			name: "Richard",
			room: "React Course"
		},{
			id: 3,
			name: "Rachel",
			room: "Node Course"
		}];
	});


  it('should add a new user', () => {
    var users = new Users();
    var user = {
    	id: '123abc',
    	name: 'Neil',
    	room: 'Politics'
    }
    var res = users.addUser(user.id,user.name,user.room);
    expect(users.users).toEqual([user]);
  });

  it('should return names for Node Course', () => {
    var userList = users.getUserList("Node Course");
    expect(userList).toEqual(['Julie','Rachel']);
  });

  it('should return names for React Course', () => {
    var userList = users.getUserList("React Course");
    expect(userList).toEqual(['Richard']);
  });

  it('should remove a user', () => {
    var userId = 2, user = users.removeUser(userId);
    expect(user.id).toEqual(userId);
    expect(users.users.length).toBe(2);
  });

  it('should not remove a user', () => {
    var userId = 99, user = users.removeUser(userId);
    expect(user).toNotExist();
    expect(users.users.length).toBe(3);
  });

  it('should find a user by id', () => {
    var userId = 1, user = users.getUser(userId);
    expect(user.id).toEqual(userId);
    expect(user.name).toEqual("Julie");
  });

  it('should not find a user by id', () => {
    var userId = 99, user = users.getUser(userId);
    expect(user).toNotExist();
  });

});