import { gql } from '@apollo/client';

export const CREATE_USER = gql`
  mutation createUser($firstName: String!, $lastName: String!, $username: String!, $age: Number!, $gender: String!, $genderInterest: String!, $bio: String) {
    createUser(firstName: $firstName, lastName: $lastName, username: $username, age: $age, gender: $gender, genderInterest: $genderInterest, bio: $bio) {
      _id
      firstName
      lastName
      username
      age
      gender
      genderInterest
      bio
    }
  }
`;

export const LOGIN_USER = gql`
  mutation loginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      email
      password
    }
  }
`;

export const DELETE_USER = gql`
  mutation deleteUser($userId: ID!, $password: String!) {
    deleteUser(userId: $userId, password: $password) {
      _id
      password
    }
  }
`;

export const ADD_LIKED_USER = gql`
  mutation addLikedUser($userId: ID!, $likedUserId: ID!) {
    addLikedUser(userId: $userId, likedUserId: $likedUserId) {
      _id
    }
  }
`;

export const REMOVE_LIKED_USER = gql`
  mutation removeLikedUser($userId: ID!, $likedUserId: ID!) {
    removeLikedUser(userId: $userId, likedUserId: $likedUserId) {
      _id
    }
  }
`;