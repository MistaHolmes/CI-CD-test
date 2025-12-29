import prisma from "../lib/prisma";
import type { CreateUserInput } from "../types/types";

export async function getAllUsers(){
    return prisma.user.findMany();
}

export async function getUser(req:String){
    return prisma.user.findFirst({
        where:{
            email: `${req}`
        }
    })
}

export async function createUser(req:CreateUserInput){
    const {email, password, name} = req;
    return prisma.user.create({
        data:{
            email:email,
            password:password,
            name:name
        }
    })
}