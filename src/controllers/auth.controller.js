import { sql } from "../libs/db.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const Login = async (req, res) => {
    try {
        const data = req.body
        // validation
        if (!data || !data.email || !data.password) {
            return res.send({
                success: false,
                message: "Fields are required",
                error: {
                    email: true,
                    password: true
                }
            })
        }

        const { password, email } = data

        // fetch: query
        const result = await sql`SELECT * FROM "user" WHERE email = ${email}`;

        // if data not available
        if (!result || result.length == 0) {
            return res.send({
                success: false,
                message: "data not available"
            })
        }
        const users = result[0]

        //compare hashpassword to input password
        let isAuth = bcrypt.compare(password, users.password);
        if (isAuth == false) {
            return res.send({
                success: false,
                message: "invalid password"
            })
        }

        // create token
        const payload = {
            exp: Math.floor(Date.now() / 1000) + (60 * 60),
            data: {
                id: users.id,
                name: users.name,
                email: users.email
            }
        }
        const token = jwt.sign(payload, 'secret');

        // response
        return res.send({
            success: true,
            message: "Login successfull",
            result: {
                token: token,
                user: { ...result[0], password: undefined } // exclude password from user data
            }
        })
    } catch (error) {
        return res.send({
            success: false,
            message: "Internal server error",
            error
        })
    }
}



export const Register = async (req, res) => {
    try {
        const data = req.body
        // validation
        if (!data || !data.name || !data.email || !data.password) {
            return res.send({
                success: false,
                message: "Fields are required",
                error: {
                    name: true,
                    email: true,
                    password: true
                }
            })
        }

        const { name, password, email } = data
        // password hashing
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        // creation: query
        const result = await sql`INSERT INTO "user" (name, email, password) VALUES (${name}, ${email}, ${hash})`;

        // response
        return res.send({
            success: true,
            message: "Registeration successfull",
            result
        })
    } catch (error) {
        return res.send({
            success: false,
            message: "Internal server error",
            error
        })
    }
}