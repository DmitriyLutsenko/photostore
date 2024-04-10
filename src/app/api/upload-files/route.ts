//import { type NextRe } from "next";
import formidable, { errors as formidableErrors } from 'formidable';
import { existsSync, promises as fs } from 'fs';
// import path from 'path';
// import sharp from "sharp";
import { createHash } from "crypto";
import path from "path";
import { NextResponse, NextRequest } from "next/server";
import { writeFile } from 'fs/promises'; 

export type ResponseFileUpload = { links: string[] }
type fieldsType = { uploadPath?: string[], md5?: string[], files?: string[], image?: string[], nameFile?: string[] }

// For preventing header corruption, specifically Content-Length header
export const config = {
    api: {
        bodyParser: false,
    }
}

export async function POST(
    req: NextRequest,
    res: NextResponse
) {
    // const form = formidable({});

    let fields: fieldsType = {};
    // let files;
    const linkFiles = [];

    try {
        //[fields, files] = await form.parse(req);
        const formData = await req.formData();
        const files = formData.getAll("files") as [File] | null;
        const directory = formData.get("uploadPath") as string | null;
        console.log("==============directory========================");
        console.log(fields);
        console.log("===============================================");
        
        if(!files){
            return NextResponse.json({error: "No Files"}, {status: 400});
        }

        for (const file of files) {
            console.log(file);

            if (file.name == undefined ) continue;

            else { 
                let buffer = Buffer.from(await file.arrayBuffer()); //тут чтобы не было ошибки сделать
                let ext = path.extname((file.name) as string);

                let nameGenerate = makeid(16) + ext;

                            

                        linkFiles.push(`${directory === "" ? "" : '/'}${directory}/${nameGenerate}`);

                    if (!existsSync(`public/${directory}`)) {
                        await fs.mkdir(`public/${directory}`);
                    }
                    await writeFile(
                        path.join(process.cwd(), `public/${directory}/${nameGenerate}`), //тут тоже скорее всего дело в тайпскрипте ну и весь код внизу надо сюда затощить чтобы и объект возвращался как и раньше
                        buffer
                    )
            }
        }

    } catch (error) {

        console.error(error);
        return NextResponse.json({Message: error, status: 500});
    }

    return NextResponse.json({ links: linkFiles as [string] } as ResponseFileUpload);
}

function makeid(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}
