import axios from 'axios';
import prismaClient from '../prisma';
import { sign } from 'jsonwebtoken';
const { GITHUB_CLIENT_ID, 
        GITHUB_CLIENT_SECRET, 
        GITHUB_CLIENT_SECRET_MOBILE, 
        GITHUB_CLIENT_ID_MOBILE, 
        JWT_SECRET 
    } = process.env;

/**
 * Receber code(string)
 * Recuperar o access_token no github
 * Recuperar info do user no github
 * Verificar se o usuario existe no banco de dados
 * -- Se Existir = Gerar um Token
 * -- Se não existir = Cria no banco e gera um token
 * Retornar o token com as informações do usuario logado
 */

interface IAccessTokenResponse { 
    access_token: string;
}

interface IUserResponse {
    avatar_url: string;
    login: string;
    id: number;
    name: string;
}

class AuthenticateUserService {
    async execute(code: string, client_id: string | undefined) {
        const url = "https://github.com/login/oauth/access_token";
        const urlApi = "https://api.github.com/user"

        console.log('client_id : ', client_id)

        const { data: { access_token } } = await axios.post<IAccessTokenResponse>(url, null, {
            params: {
                client_id: client_id ? GITHUB_CLIENT_ID_MOBILE: GITHUB_CLIENT_ID,
                client_secret: client_id ? GITHUB_CLIENT_SECRET_MOBILE: GITHUB_CLIENT_SECRET,
                code
            },
            headers: {
                "Accept": "application/json"
            }
        });

        console.log(access_token);


        const { data } = await axios.get<IUserResponse>(urlApi, {
            headers: {
                authorization: `Bearer ${access_token}`,
            }
        });

        const { login, id: github_id, avatar_url, name } = data;


        const user = await prismaClient.user.findFirst({
            where: {
                github_id
            }
        })

        if (!user) {
            await prismaClient.user.create({
                data: {
                    github_id,
                    login,
                    avatar_url,
                    name
                }
            })
        }

        const token = sign({
            user: {
                user: user.name,
                avatar_url: user.avatar_url,
                id: user.id
            }
        }, 
        JWT_SECRET, 
        {
            subject: user.id,
            expiresIn: "1d"
        })

        return { token, user };
    }
}

export { AuthenticateUserService }