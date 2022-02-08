/**
 * @summary
 *
 * Gallery service for client
 */

import { CreateGalleryDto, DeleteGalleryDto, UpdateGalleryDto } from "client/modules/file/dto/gallery";
import { File } from "client/modules/file/types/file";
import { EntityServicePrototype } from "client/prototypes/entity-service-prototype";
import { Mutation } from "common/lib/graphql/mutation";
import { Query } from "common/lib/graphql/query";
import { Gallery } from "../types/gallery";

export class GalleryService extends EntityServicePrototype<
    Gallery,
    CreateGalleryDto,
    UpdateGalleryDto,
    DeleteGalleryDto
> {
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
        super(Gallery, "gallery", "galleries", "createGallery", "updateGallery", "deleteGallery");
    }

    /**
     * @inheritdoc
     */
    protected getUsedEntityFields(): string[] {
        return ["id", "name", "created_at", "updated_at", "image_count"];
    }

    /**
     * @inheritdoc
     */
    protected getEntityFieldGraphQLTypes(): { id?: string; name?: string; images?: string; image_count?: string } {
        return {
            id: "Int!",
            name: "String!",
            image_count: "Int",
        };
    }

    /**
     * Retrives all images for given gallery
     * @param gallery_id
     * @returns
     */
    public async getImages(gallery_id: number, limit = 0, offset = 0): Promise<File[]> {
        const gallery = await this.graphql_service.get(
            new Query(this.query_one)
                .with({ id: gallery_id })
                .take("images(offset:$offset,limit:$limit){file{id,path}}")
                .vars({
                    offset: {
                        type: "Int",
                        value: offset,
                    },
                    limit: {
                        type: "Int",
                        value: limit,
                    },
                })
        );
        return gallery?.images || [];
    }

    /**
     * Finds galleries by name
     * @param name
     * @returns
     */
    public async findByName(name: string, count = 10): Promise<Gallery[]> {
        return this.graphql_service.get(
            new Query(this.query_list).with({ name, page_size: count }).take("id,name,image_count")
        );
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

        const gallery = await this.graphql_service.get(
            new Mutation(this.mutation_attach_images)
                .with({ gallery_id: gallery_id, image_ids: "$ids" })
                .vars({
                    ids: {
                        type: "[Int!]!",
                        value: image_ids,
                    },
                })
                .take("id")
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
            new Mutation(this.mutation_detach_images)
                .with({ gallery_id: gallery_id, image_ids: "$ids" })
                .vars({
                    ids: {
                        type: "[Int!]!",
                        value: image_ids,
                    },
                })
                .take("id")
        );
    }

    /**
     * Creates new gallery
     * @returns
     */
    public async create(gallery_name: string): Promise<any> {
        return await this.graphql_service.get(
            new Mutation(this.mutation_new)
                .with({ name: "$gallery_name" })
                .vars({
                    gallery_name: {
                        type: "String",
                        value: gallery_name,
                    },
                })
                .take("id,name")
        );
    }

    /**
     * Updates gallery name
     * @param id
     * @param gallery_name
     * @returns
     */
    public async updateName(id: number, gallery_name: string): Promise<Gallery> {
        return await this.graphql_service.get(
            new Mutation(this.mutation_update)
                .with({ id, name: "$gallery_name" })
                .vars({
                    gallery_name: {
                        type: "String",
                        value: gallery_name,
                    },
                })
                .take("id")
        );
    }

    /**
     * Retrive gallery by id
     * @param id
     * @returns
     */
    public async getById(id: number, with_count = false): Promise<Gallery> {
        const query = new Query(this.query_one).with({ id }).take("id,name");
        if (with_count) {
            query.take("image_count");
        }
        return await this.graphql_service.get(query);
    }

    /**
     * Removes all images from gallery
     * @param gallery_id
     * @returns
     */
    public async clearGallery(gallery_id: number, delete_images = false): Promise<void> {
        return await this.graphql_service.get(
            new Mutation(this.mutation_clear_gallery).with({ gallery_id: gallery_id, delete: delete_images }).take("id")
        );
    }

    /**
     * Returns all galleries
     * @returns
     */
    public async getAll(): Promise<Gallery[]> {
        return await this.graphql_service.get(new Query(this.query_list).take(...this.getUsedEntityFields()));
    }

    /**
     * Deletes gallery by id
     * @param id
     * @returns
     */
    public async deleteById(id: number): Promise<boolean> {
        return await this.graphql_service.get(new Mutation(this.mutation_delete).with({ id }));
    }
}
