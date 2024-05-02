"use server"

import { join } from "path";
import { mkdir, stat, writeFile } from "fs/promises";
import fs from "node:fs/promises";
import dayjs from 'dayjs';
export default async function upload(folder, image, isBac = false, session = 0) {
    const uploadDir = join(
        process.env.ROOT_DIR || process.cwd(),
        `/public/uploads/${folder}/`
    );
    const buffer = Buffer.from(await image.arrayBuffer());
    const filename = folder === "results"
        ? isBac
            ? session === 1
                ? `session_1_${dayjs(new Date()).format('YYYY_MM_DD_HH_mm_ss')}.${image.name.toString().split(".").pop()}`
                : `session_2_${dayjs(new Date()).format('YYYY_MM_DD_HH_mm_ss')}.${image.name.toString().split(".").pop()}`
            : `${Date.now()}_${dayjs(new Date()).format('YYYY_MM_DD_HH_mm_ss')}_${image.name.replaceAll(" ", "_").replaceAll("-", "_")}`
        : Date.now() + image.name.replaceAll(" ", "_").replaceAll("-", "_");
    try {
        await stat(uploadDir);
    } catch (e) {
        if (e.code === "ENOENT") {
            await mkdir(uploadDir, { recursive: true });
        } else {
            console.error(e);
        }
    }
    await writeFile(
        uploadDir + filename,
        buffer
    );

    return filename;
}

export async function isFileExist(folder, file) {
    try {
        return (await fs.stat(`public/uploads/${folder}/${file}`)).isFile();
    } catch (e) {
        return false;
    }
}

export async function deleteFile(folder, file) {
    try {
        await fs.unlink(`public/uploads/${folder}/${file}`);
        return true
    } catch (e) {
        return false;
    }
}

