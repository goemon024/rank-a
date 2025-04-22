// lib/api.ts
import prisma from '@/lib/prisma'

export const getUserById = async (id: string) => {
    return await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            username: true,
            email: true,
            imagePath: true,
            createdAt: true,
        },
    })
}
