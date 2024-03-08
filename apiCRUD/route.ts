import { createEdgeRouter } from "next-connect";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

const router = createEdgeRouter<NextRequest, { params?: unknown }>();

interface DataRequest {
    CRUDuserID: string
}

//POST Create User School
router.post(async (req, res) => {
    const body = await req.json();

    //user cant contain 2 or more school
    const user = await prisma.CRUDuser.findFirst({
        where: { CRUDuser_id: body?.CRUDuserID }
    })


    try {
        //input the data to database
        const createUser = await prisma.CRUDuser.create({
            data: {
                CRUDuser_id: body?.CRUDuserID,
            }
        })

        return NextResponse.json({
            message: "Error Create User",
        }, { status: 200 });

    } catch (error) {
        //console.log(error)
        return NextResponse.json({ message: "Error Creating User", status: 406 })
    }
});

//PUT Update User School
router.put(async (req, res) => {
    const body = await req.json();

    try {
        const editUserSchool = await prisma.CRUDuser.update({
            where: {
                CRUDuser_id: {
                    CRUDuser_id: body?.CRUDuserID
                }
            },
            data: {
                school_id: body?.schoolchangeID
            },
        })
        return NextResponse.json({
            message: "Update User School Successful",
        }, { status: 200 });
    } catch (error) {
        //console.log(error)
        return NextResponse.json({ message: "User ID does not Exist", status: 406 })
    }
});

//PATCH Show User School
router.patch(async (req, res) => {
    const body = await req.json();

    //query data from database 
    const userschoolShow = await prisma.CRUDuser.findFirst({
        where: { CRUDuser_id: body?.CRUDuserID }
    })
    if (!userschoolShow) {
        return NextResponse.json({ message: "This School ID Does Not Exist" }, { status: 406 })
    }

    return NextResponse.json({ userschoolShow }, { status: 200 })
});

//Delete by user ID because School Contain many user but user can contain only 1 school
router.delete(async (req, res) => {
    const body = await req.json();

    try {
        const deleteuserSchool = await prisma.CRUDuser.delete({
            where: {
                CRUDuser_id_school_id: {
                    CRUDuser_id: body?.CRUDuserID,
                    school_id: body?.schoolID
                }
            },
        });

        return NextResponse.json({
            message: "User Schools has been deleted",
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: "Error Deleting User School", status: 406 })
    }
});

export async function POST(request: NextRequest, ctx: { params?: unknown }) {
    return router.run(request, ctx);
}
export async function PUT(request: NextRequest, ctx: { params?: unknown }) {
    return router.run(request, ctx);
}
export async function PATCH(request: NextRequest, ctx: { params?: unknown }) {
    return router.run(request, ctx);
}
export async function DELETE(request: NextRequest, ctx: { params?: unknown }) {
    return router.run(request, ctx);
}