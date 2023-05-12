const { AuthenticationError } = require('apollo-server-express');
const { User, Message } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
	Query: {
		getUser: async (parent, { userId }) => {
			const foundUser = await User.findOne({ _id: userId });

			if (!foundUser) {
				throw new Error('Cannot find user with that ID!');
			}

			return foundUser;
		},
	
		allUsers: async () => {
			const allUsers = await User.find({});
			console.log(allUsers);
			if (!allUsers) {
				throw new Error('Something went wrong');
			}

			return allUsers;
		},
		allMen: async () => {
			const users = await User.find({ gender: 'male' });
			if (!users) {
				throw new Error('Something went wrong');
			}
			return users;
		},
		allWomen: async () => {
			const users = await User.find({ gender: 'female' });
			if (!users) {
				throw new Error('Something went wrong');
			}
			return users;
		},
		allMatches: async () => {
			const matches = await User.find({ saidYesTo: { $ne: [] } });
			if (!matches) {
				throw new Error('Sorry! You have no matches.');
			}
			return matches;
		},
		possibleMatches: async (parent, args) => {
			if (!args) {
				throw new AuthenticationError("No logged in user. You must be logged in.")
				
			} 
			const loggedInUser = await User.find({ _id: args.userId } );
			const matches = await User.find( {gender: loggedInUser.genderInterest} );
			console.log(matches)
			if (!matches) {
				throw new Error('Sorry! You have no matches.');
			}
			return matches;
	},
},
	Mutation: {
		createUser: async (
			parent,
			{
				firstName,
				lastName,
				username,
				password,
				age,
				gender,
				genderInterest,
				bio,
			}
		) => {
			const newUser = await User.create({
				firstName,
				lastName,
				username,
				password,
				age,
				gender,
				genderInterest,
				bio,
			});

			const token = signToken(newUser);
			console.log(`signing token with ${newUser} info...`);

			return { token, newUser };
		},
		loginUser: async (parent, { username, password }) => {
			const user = await User.findOne({ username });

			if (!user) {
				throw new AuthenticationError('No user found with that email!');
			}

			const correctPassword = await user.isCorrectPassword(password);

			if (!correctPassword) {
				throw new AuthenticationError('Incorrect password!');
			}

			const token = signToken(user);

			return { token, user };
		},
		deleteUser: async (parent, { userId, password }) => {
			const user = await User.findOne({ userId });

			if (!user) {
				throw new AuthenticationError('No user with that ID.');
			}

			const correctPassword = await user.isCorrectPassword(password);

			if (!correctPassword) {
				throw new AuthenticationError('Incorrect password.');
			}

			const token = signToken(newUser);

			return { token, newUser };
		},

		addLikedUser: async (parent, { userId, likedUserId }) => {
			const user = await User.findOneAndUpdate(
				{ _id: userId },
				{ $addToSet: { likedUsers: likedUserId } },
				{
					new: true,
					runValidators: true,
				}
			);
			if (!userId) {
				throw new Error(
					'Could not retrieve user-data, please refresh and try again.'
				);
			}

			return user;
		},

		removeLikedUser: async (parent, { userId, likedUserId }) => {
			const user = await User.findOneAndUpdate(
				{ _id: userId },
				{ $pull: { likedUsers: likedUserId } }
			);
			return user;
		},

		createMessage: async (
			parent,
			{ messageSenderId, messageRecipientId, messageBody }
		) => {
			console.log(`creating message: ${messageBody}`);
			const message = await Message.create({
				messageSenderId,
				messageRecipientId,
				messageBody,
			});
			console.log(message);
			return message;
		},

		deleteMessage: async (parent, { userId, messageId }) => {
			const user = await User.findOneAndUpdate(
				{ _id: userId },
				{ $pull: { messages: messageId } }
			);
			return message;
		},
	},
  
};

module.exports = resolvers;
