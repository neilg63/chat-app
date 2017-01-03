
class Users {

	constructor() {
		this.users = [];
	}

	addUser (id, name, room) {
		var user = {id:id, name: name, room: room};
		this.users.push(user);
	}

	removeUser (id) {
		var user = this.getUser(id);
		if (user) {
			this.users = this.users.filter((user) => user.id !== id);
		}
		return user;
	}

	getUser(id) {
		var filteredUsers = this.users.filter((user) => user.id === id);
		if (filteredUsers.length > 0) {
			return filteredUsers[0];
		}
	}

	getUserList(room) {
		var users = this.users.filter((user) => user.room === room);
		var namesArray = users.map((user) => user.name);
		return namesArray;
	}

}


module.exports = {Users};
