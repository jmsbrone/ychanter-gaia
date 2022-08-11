import {
    CRUDResourceSchema,
    CRUDResourceSchemaPrototype,
    GenericResourceSchema,
    ResourceSchema,
} from "@ychanter/graphql-client";
import { EntityServicePrototype } from "../../../core/prototypes/entity-service-prototype";
import { WebPagesAPI } from "../api";
import { WebPage } from "../domains/web-page";
import { CreateWebPageDto, UpdateWebPageDto, DeleteWebPageDto } from "../dto/web-page-dto";

export class WebPageService
    extends EntityServicePrototype<WebPage, CreateWebPageDto, UpdateWebPageDto, DeleteWebPageDto>
    implements WebPagesAPI
{
    /**
     * @inheritdoc
     */
    protected createSchema(): CRUDResourceSchema {
        return new CRUDResourceSchemaPrototype({
            deleteResourceQuery: "deleteWebPage",
            saveResourceQuery: "saveWebPage",
            singleResourceQuery: "webPage",
            listResourceQuery: "webPages",
            queries: {
                deleteWebPage: ["id"],
                saveWebPage: [],
                webPages: [],
                webPage: [],
            },
            fieldsTypes: {
                id: "Int",
                name: "String",
                alias: "String",
                path: "String",
                content: "String",
                parent: "Int",
                system: "Boolean",
            },
        });
    }

    /**
     * Schema for web page resources
     */
    protected webPageResourcesSchema: ResourceSchema = new GenericResourceSchema({
        queries: {
            updateWebPageResources: ["id", "file_ids", "gallery_ids"],
        },
        fieldsTypes: {
            id: "Int",
            file_ids: "[Int!]",
            gallery_ids: "[Int!]",
        },
    });

    constructor() {
        super(WebPage);
    }

    /**
     * @inheritdoc
     */
    protected getUsedEntityFieldsOne(): string[] {
        return [
            "id",
            "alias",
            "name",
            "path",
            "parent",
            "system",
            "content",
            "child_count",
        ];
    }

    /**
     * Returns a list of sub pages for given web page
     * @param parentId
     * @returns
     */
    public async getListByParent(parentId: number): Promise<WebPage[]> {
        return this.getListByQuery(this.schema.getQueryMany({ parent: parentId }, this.getUsedEntityFieldsOne()));
    }

    /**
     * Finds a wen page for given path
     * @param path
     * @returns
     */
    public async getByPath(path: string): Promise<WebPage | null> {
        return this.getOneByQuery(this.schema.getQueryOne({ path: path }, this.getUsedEntityFieldsOne()).take("content"));
    }

    /**
     * Updates web page resources
     * @param webPageId
     * @param files
     * @param galleries
     * @returns
     */
    public async updateWebPageResources(webPageId: number, files: number[], galleries: number[]): Promise<void> {
        return this.graphql_service.get(
            this.webPageResourcesSchema.getMutation(
                "updateWebPageResources",
                { id: webPageId, file_ids: files, gallery_ids: galleries },
                []
            )
        );
    }
}
