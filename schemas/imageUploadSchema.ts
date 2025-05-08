// import { z } from "zod";

// const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
// const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

// export const imageUploadSchema = z
//     .instanceof(File)
//     .refine((file) => file.size <= 1 * 1024 * 1024, {
//         message: "1MB以下の画像を選択してください",
//     })
//     .refine((file) => ALLOWED_MIME_TYPES.includes(file.type), {
//         message: "対応していない画像形式です（JPEG/PNG/WebP）",
//     })
//     .refine((file) => {
//         const name = file.name.toLowerCase();
//         return ALLOWED_EXTENSIONS.some((ext) => name.endsWith(ext));
//     }, {
//         message: "ファイル拡張子が不正です",
//     })
//     .optional();


import { z } from "zod";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

export const imageUploadSchema = z
    .custom<File | Blob>((file) => {
        return (
            file &&
            typeof file === "object" &&
            "type" in file &&
            "size" in file &&
            typeof (file as Blob).size === "number" &&
            typeof (file as File).type === "string"
        );
    }, {
        message: "ファイルが不正です",
    })
    .refine((file) => (file as Blob).size <= 1 * 1024 * 1024, {
        message: "1MB以下の画像を選択してください",
    })
    .refine((file) => ALLOWED_MIME_TYPES.includes((file as File).type), {
        message: "対応していない画像形式です（JPEG/PNG/WebP）",
    })
    .refine((file) => {
        const name = (file as File).name?.toLowerCase?.();
        return typeof name === "string" && ALLOWED_EXTENSIONS.some((ext) => name.endsWith(ext));
    }, {
        message: "ファイル拡張子が不正です",
    })
    .optional();
