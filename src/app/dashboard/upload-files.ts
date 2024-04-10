import { type NextApiRequest, type NextApiResponse } from "next";
import formidable, { errors as formidableErrors } from 'formidable';
import { existsSync, promises as fs } from 'fs';
// import path from 'path';
import sharp from "sharp";
import path from "path";

export type ResponseFileUpload = { links: [string] }
type fieldsType = { uploadPath?: string[], md5?: string[], files?: string[], image?: string[], nameFile?: string[] }

// For preventing header corruption, specifically Content-Length header
export const config = {
    api: {
        bodyParser: false,
    }
}


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseFileUpload | null>
) {
    const form = formidable({});

    let fields: fieldsType;
    let files;
    const linkFiles = [];

    try {
        [fields, files] = await form.parse(req);
        if (files.files) {
            for (const file of files.files) {
                if (file.originalFilename) {
                    // const nameGenerate = (fields.md5 ? fields.md5?.[0] : makeid(8)) + path.extname(file.originalFilename);

                    const nameGenerate = (
                        fields.nameFile?.[0]
                            ? fields.nameFile?.[0]
                            : (fields.md5
                                ? fields.md5?.[0]
                                : makeid(8))) + ((fields.image && fields.image?.[0] === 'ok') ? '.webp' : path.extname(file.originalFilename));
                    linkFiles.push(`${fields?.uploadPath?.[0] === '' ? '' : '/'}${fields?.uploadPath?.[0]}/${nameGenerate}`);

                    if (!existsSync(`public/${fields?.uploadPath?.[0]}`)) {
                        await fs.mkdir(`public/${fields?.uploadPath?.[0]}`);
                    }
                    if ((fields.image && fields.image?.[0] === 'ok')) {
                        await sharp(file.filepath).webp({ quality: 80 }).rotate().toFile(`public/${fields?.uploadPath?.[0]}/${nameGenerate}`)
                    } else {
                        await fs.copyFile(file.filepath, `public/${fields?.uploadPath?.[0]}/${nameGenerate}`);
                    }

                    // await fs.copyFile(file.filepath, `public/${fields?.uploadPath?.[0]}/${nameGenerate}`);
                }
            }
        }
    } catch (error) {
        if (error instanceof Error) {
            console.log(error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
        }

        res.end(String(error));
        return;
    }

    res.status(200).json({ links: linkFiles } as ResponseFileUpload);
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