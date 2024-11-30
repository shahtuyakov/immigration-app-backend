export interface CreateUserDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: "user" | "lawyer" | "admin";
}

export interface UpdateUserDTO {
  firstName?: string;
  lastName?: string;
  email?: string;
}  

export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

// Response DTOs - what we send back to the client
export interface UserResponseDTO {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: Date;
}

// Utility type to transform mongoose documents to response DTOs
export function toUserResponseDTO(user: any): UserResponseDTO {
  return {
    id: user._id.toString(),
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    createdAt: user.createdAt,
  };
}
