import { auth } from "@clerk/nextjs"

const adminIds = [
    'user_2dkKmYXhRa4GJrD0qObBQZBNtlY',
]

export const isAdmin = () => {
    const { userId } = auth()

    if (!userId) {
        return false
    }

    return adminIds.indexOf(userId) !== -1
}