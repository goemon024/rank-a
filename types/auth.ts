export enum Role {
    Student = "Student",
    Admin = "Admin"
}

export type UserPayload = {
    userId: string
    username: string
    imagePath: string
    role: Role
    exp: number
}