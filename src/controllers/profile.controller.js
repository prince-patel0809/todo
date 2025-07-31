import { sql } from "../libs/db.js"


// get api for profile
export const GetProfile = async (req, res) => {
    try {
        const result = await sql`SELECT id, name, email FROM "user" WHERE id =${req?.user.id}`
        if (!result || result.length == 0) {
            return res.send({
                success: false,
                message: "data not available"

            })
        }

        return res.send({
            success: true,
            message: "data fetch successfully",
            result: result[0]
        })
    } catch (error) {
        return res.send({
            success: false,
            message: "internal server error",
            error
        })

    }
}

// update profile 
export const UpdateProfile = async (req, res) => {
    try {
        const data = req.body
        if (!data || !data.name) {
            return res.send({
                success: false,
                message: "Fields are required",
                error: {
                    name: true
                }
            })
        }
        const fetchresult = await sql`SELECT id ,name,email FROM "user" WHERE id = ${req?.user.id}`;

        const { name } = data;
        const result = await sql`UPDATE "user" SET name = ${name} WHERE id=${req?.user.id} RETURNING id, name, email`;
        return res.send({
            success: true,
            fetchresult,
            message: "data update successfully",
            result: result[0]
        })
    } catch (error) {
        return res.send({
            success: true,
            message: "internal server error",
            error
        })
    }

}