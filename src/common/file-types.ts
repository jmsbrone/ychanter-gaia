/**
 * @module Common.Types.FileType
 */

export enum FileType {
    Image = "image",
    Document = "document",
    Icon = "icon",
}

/**
 * Returns supported extensions for given type
 * @param type
 * @returns
 */
export function getExtensionsByType(type: FileType): string[] {
    switch (type) {
        case FileType.Image:
            return ["jpg", "jpeg", "png"];
        case FileType.Document:
            return ["doc"];
        case FileType.Icon:
            return ["ico"];
        default:
            throw new Error("Specified type (" + type + ") is not supported");
    }
}
