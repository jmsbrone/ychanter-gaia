import { CRUDResourceSchema, CRUDResourceSchemaPrototype } from "@ychanter/graphql-client";
import { EntityServicePrototype } from "../../../core/prototypes/entity-service-prototype";
import { GalleryAPI } from "../api";
import { CreateGalleryDto, DeleteGalleryDto, UpdateGalleryDto } from "../dto/gallery";
import { Gallery } from "../types/gallery";
import { Image } from "../types/image";

export class GalleryService extends EntityServicePrototype<
    Gallery,
    CreateGalleryDto,
    UpdateGalleryDto,
    DeleteGalleryDto
> implements GalleryAPI {
    /**
     * Mutation for attaching images to a gallery
     */
    private readonly mutation_attach_images = "attachImagesToGallery";

    /**
     * Mutation for detaching images from a gallery
     */
    private readonly mutation_detach_images = "detachImagesFromGallery";

    /**
     * Mutation for clearing all images from a gallery
     */
    private readonly mutation_clear_gallery = "clearGallery";

    constructor() {
        super(Gallery);
    }

    /**
     * @inheritdoc
     */
    protected createSchema(): CRUDResourceSchema {
        return new CRUDResourceSchemaPrototype({
            listResourceQuery: "galleries",
            saveResourceQuery: "saveGallery",
            singleResourceQuery: "gallery",
            deleteResourceQuery: "deleteGallery",
            queries: {
                gallery: ["id"],
                galleries: [],
                saveGallery: ["name"],
                deleteGallery: ["id"],
                attachImagesToGallery: ["id", "image_ids"],
                detachImagesFromGallery: ["id", "image_ids"],
                clearGallery: ["id"],
            },
            fieldsTypes: {
                id: "Int",
                name: "String",
                created_at: "DateTime",
                updated_at: "DateTime",
                image_count: "Int",
                images: "[Int!]",
                image_ids: "[Int!]",
                page_size: "Int",
            },
        });
    }

    /**
     * @inheritdoc
     */
    protected getUsedEntityFieldsOne(): string[] {
        return ["id", "name", "created_at", "updated_at", "image_count"];
    }

    /**
     * Retrives all images for given gallery
     * @param gallery_id
     * @returns
     */
    public async getImages(gallery_id: number, limit = 0, offset = 0): Promise<Image[]> {
        const gallery = await this.graphql_service.get(
            this.schema.getQueryOne({ id: gallery_id }, [`images(offset:${offset},limit:${limit}){file{id,path}}`])
        );
        return gallery?.images || [];
    }

    /**
     * Finds galleries by name
     * @param name
     * @returns
     */
    public async findByName(name: string, count = 10): Promise<Gallery[]> {
        return this.graphql_service.get(this.schema.getQueryMany({ name, page_size: count }, ["id,name,image_count"]));
    }

    /**
     * Adds new images to gallery and returns new total count of images
     * @param gallery_id
     * @param image_ids
     * @returns
     */
    public async addImages(gallery_id: number, image_ids: number[]): Promise<void> {
        if (!image_ids) {
            return;
        }

        await this.graphql_service.get(
            this.schema.getMutation(this.mutation_attach_images, { id: gallery_id, image_ids }, ["id"])
        );
    }

    /**
     * Detaches specified images from gallery. Does not delete files.
     * @param gallery_id
     * @param image_ids
     * @returns
     */
    public async detachImages(gallery_id: number, image_ids: number[]): Promise<void> {
        if (!image_ids) {
            return;
        }

        const gallery = await this.graphql_service.get(
            this.schema.getMutation(this.mutation_detach_images, { id: gallery_id, image_ids }, ["id"])
        );
    }

    /**
     * Removes all images from gallery
     * @param gallery_id
     * @returns
     */
    public async clearGallery(gallery_id: number, delete_images = false): Promise<void> {
        return await this.graphql_service.get(
            this.schema.getMutation(this.mutation_clear_gallery, { id: gallery_id }, [
                "id",
            ])
        );
    }
}
