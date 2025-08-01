// post (creation)

import { sql } from "../libs/db.js"

export const PostTodo = async (req, res) => {
    try {
        const data = req.body

        if (!data || !data.title || !data.description) {
            return res.send({
                success: false,
                message: "fields are required",
                fields: {
                    title: true,
                    description: true
                }
            })
        }
        const { title, description } = data;

        if (!title || !description) {
            return res.send({
                success: false,
                message: "all fields are required",
                fields: {
                    title: true,
                    description: true
                }
            })
        }
        const result = await sql`INSERT INTO "todo"(title, description, user_id)  VALUES (${title}, ${description}, ${req?.user.id})  RETURNING *;`;
        return res.send({
            success: true,
            message: "insert data successfully",
            result
        })

    } catch (error) {
        return res.send({
            success: false,
            message: "internal server error",
            error: error
        })

    }
}

// put (update)

export const PutTodos = async (req, res) => {
    try {
        const data = req.body
        const params = req.params
        if (!data || !data.title || !data.description) {
            return res.send({
                success: false,
                message: "fields are required",
                fields: {
                    title: true,
                    description: true
                }
            })
        }


        const { title, description } = data
        const checkResult = await sql`SELECT title,description FROM "todo" WHERE id=${params.id} AND user_id = ${req?.user.id}`;
        if (!checkResult || checkResult.length == 0) {
            return res.send({
                success: false,
                message: "not data available"
            })
        }
        const result = await sql`UPDATE "todo" SET title=${title} , description = ${description} WHERE id = ${params.id} AND user_id =${req?.user.id} RETURNING *;`;
        return res.send({
            success: true,
            checkResult,
            message: "update successfully",
            result

        })
    } catch (error) {
        return res.send({
            success: false,
            message: "internal server error",
            error: error
        })
    }

}

// fetch only one todo (GetOneTodo)
export const GetOneTodo = async (req, res) => {
    try {
        const params = req.params
        const result = await sql`SELECT title , description FROM "todo" WHERE id = ${params.id} AND user_id=${req?.user.id}`;
        if (!result) {
            return res.send({
                success: false,
                message: "data not available"
            })
        }


        return res.send({
            success: true,
            message: "fetch successfully",
            result
        })

    } catch (error) {
        console.log(error);

        return res.send({
            success: false,
            message: "internal server error",
            error: error
        })
    }
}


// paginated Get All
export const GetAllTodo = async (req, res) => {
    try {
        let page = 1;
        let limit = 10;

        const query = req.query

        if (query.limit && !isNaN(query.limit) && Number(query.limit) > 0 && Number(query.limit) <= 100) {
            limit = Number(query.limit)
        }

        if (query.page && !isNaN(query.page) && Number(query.page) > 0) {
            page = Number(query.page)
        }

        if (query.search) {
            search = query.search
        }

        const count = await sql`
        SELECT
            count(id) 
        FROM "todo" 
        WHERE 
            user_id=${req?.user.id}
        `;

        const result = await sql`
        SELECT
            *
        FROM "todo" 
        WHERE 
            user_id=${req?.user.id}
        LIMIT ${limit} OFFSET ${(page - 1) * limit}
        `;

        if (!result) {
            return res.send({
                success: false,
                message: "data not available"
            })
        }

        return res.send({
            success: true,
            message: "fetch successfully",
            result: {
                todos: result,
                pageination: {
                    limit,
                    page,
                    totalResultCount: Number(count[0].count)
                }
            }
        })


    } catch (error) {
        // console.log(error);

        return res.send({
            success: false,
            message: "internal server error",
            error: error
        })
    }
}

// delete todo
export const Deletetodo = async (req, res) => {
    try {
        const data = req.body
        if (!data) {
            return res.send({
                success: false,
                message: "data no availble",
                error
            })
        }
        const params = req.params
        const result = await sql`DELETE FROM "todo" WHEREid = ${params.id} AND user_id =${req?.user_id} `;

        return res.send({
            success: true,
            message: "deleted successfully",
            result
        })
    } catch (error) {
        return res.send({
            success: false,
            message: "internal server error",
            error
        })

    }
}