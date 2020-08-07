const users = []

const addUser = ({ id, username, room}) => {
	//clean the data
	username = username.trim().toLowerCase()
	room = room.trim().toLowerCase()

	//Validate
	if(!username || !room){
		return {
			error: 'username and room are required'
		}
	}

	//Check for exixting users
	const existingUsers = users.find((user)=>{
		return user.room === room && user.username === username
	})

	if(existingUsers){
		return {
			error: 'Username taken!'
		}
	}

	const user = {id,username,room}
	users.push(user)
	return { user }

}


const removeUser = (id) => {
	const index = users.findIndex((user)=>{
		return user.id === id
	})

	if(index !== -1){
		return users.splice(index,1)[0]
	}
}

const getUser = (id) => {
	return users.find((user) => {
		return user.id === id
	})
}

const getUserInRoom = (room) => {
	const result = []
	for(let i = 0;i < users.length ; i++){
		if(users[i].room === room)
			result.push(users[i])
	}
	return result
}



module.exports = {
	addUser,
	removeUser,
	getUser,
	getUserInRoom
}