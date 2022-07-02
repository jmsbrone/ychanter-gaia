/**
 * @module Modules.File.Services
 */

import { GraphQLService } from "client/core/components/graphql/graphql-service";
import { ClientStorage } from "client/core/components/storage/client-storage";
import { GenericResourceSchema } from "@ychanter/graphql-client";
import { Subject } from "rxjs";
import { File as FileType } from "../types/file";

/**
 * Service for working with files
 */
export class FileService {
    protected schema: GenericResourceSchema;

    public constructor(
        protected readonly graphql_service: GraphQLService = ClientStorage.getInstance().getGraphQLService()
    ) {
        this.schema = new GenericResourceSchema({
            queries: {
                createFileTransfer: ["size", "name"],
                transferFileChunk: ["transfer_id", "offset", "data"],
                updateFavicon: ["id"],
                file: ["id"],
            },
            fieldsTypes: {
                size: "Int",
                name: "String",
                data: "ByteArray",
                transfer_id: "Int",
                offset: "Int",
                path: "String",
                id: "Int",
            },
        });
    }

    /**
     * Returns an object containing information about the file that is then used
     * to upload it.
     * @param file File object from input
     * @param type File type
     * @returns
     */
    public async prepareUploadForFile(file: File, type: string): Promise<FileUploadInfo | null> {
        const store = ClientStorage.getInstance().getStore();
        const chunk_size: number = 500000; // 500KB by default
        const transfer_id = await this.createTransfer(file, type);
        const upload_observer = new Subject<FileType>();

        return {
            upload_observer,
            transfer_id,
            file,
            chunk_size,
            bytes: file.size,
            chunks: Math.ceil(file.size / chunk_size),
            type,
            uploaded: false,
            uploaded_chunks: 0,
            uploaded_bytes: 0,
        };
    }

    /**
     * Runs file upload from prepared data.
     * Returnes the resulting file.
     * @param file_upload_data
     * @returns
     */
    public async startFileUpload(file_upload_data: FileUploadInfo): Promise<FileType | null> {
        if (!file_upload_data.transfer_id) {
            file_upload_data.error = "Upload error";
        } else {
            for (; file_upload_data.uploaded_chunks < file_upload_data.chunks; ++file_upload_data.uploaded_chunks) {
                const offset = file_upload_data.chunk_size * file_upload_data.uploaded_chunks;
                const chunk = file_upload_data.file.slice(offset, file_upload_data.chunk_size + offset);
                const chunk_data = Buffer.from(await chunk.arrayBuffer());
                const created_file: FileType = await this.sendData(file_upload_data.transfer_id, offset, chunk_data);
                file_upload_data.uploaded_bytes += file_upload_data.chunk_size;
                file_upload_data.upload_observer.next(created_file);

                if (created_file) {
                    ++file_upload_data.uploaded_chunks;
                    file_upload_data.uploaded = true;
                    file_upload_data.upload_observer.complete();

                    return created_file;
                }
            }
        }

        return null;
    }

    /**
     * Creates new transfer for given file
     * @param file
     * @param file_type
     * @returns ID of the created transfer
     */
    public createTransfer(file: File, file_type?: string): Promise<number> {
        if (!file_type) {
            file_type = file.type.substring(0, file.type.lastIndexOf("/"));
        }

        return this.graphql_service.get(
            this.schema.getMutation("createFileTransfer", { size: file.size, name: file.name })
        );
    }

    /**
     * Transfers data at specified offset
     * @param transfer_id
     * @param offset
     * @param data
     * @returns
     */
    public sendData(transfer_id: number, offset: number, data: Buffer): Promise<FileType> {
        return this.graphql_service.get(
            this.schema.getMutation("transferFileChunk", { transfer_id, offset, data }, ["id", "name", "path"])
        );
    }

    /**
     * Updates favicon
     * @param new_favicon_id
     * @returns
     */
    public updateFavicon(new_favicon_id: number): Promise<void> {
        return this.graphql_service.get(
            this.schema.getMutation("updateFavicon", { id: new_favicon_id }, ["id"])
        );
    }

    /**
     * Getting file by id
     * @param id
     * @returns
     */
    public getById(id: number): Promise<File> {
        return this.graphql_service.get(
            this.schema.getQuery("file", { id }, ["id", "name", "path"])
            // new Query("file").with({ id }).take("id,name,path")
        );
    }
}

export type FileUploadInfo = {
    transfer_id: number;
    upload_observer: Subject<FileType>;
    file: File;
    chunk_size: number;
    bytes: number;
    chunks: number;
    type: string;
    uploaded_bytes: number;
    uploaded_chunks: number;
    uploaded: boolean;
    error?: string;
};
