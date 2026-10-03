import { auth } from "@clerk/nextjs/server"

export async function GET() {
    const { getToken } = await auth()

    const token = await getToken()

    return Response.json({
        token,
    })
}
