import { EntityServicePrototype } from "client/prototypes/entity-service-prototype";
import { CreateSectionDto } from "common/dto/section/create-section.dto";
import { DeleteSectionDto } from "common/dto/section/delete-section-dto";
import { UpdateSectionDto } from "common/dto/section/update-section.dto";
import {
    CRUDResourceSchema,
    CRUDResourceSchemaPrototype,
    GenericResourceSchema,
    ResourceSchema,
} from "@ychanter/graphql-client";
import { Section } from "../domains/section";

export class SectionService extends EntityServicePrototype<
    Section,
    CreateSectionDto,
    UpdateSectionDto,
    DeleteSectionDto
> {
    /**
     * @inheritdoc
     */
    protected createSchema(): CRUDResourceSchema {
        return new CRUDResourceSchemaPrototype({
            deleteResourceQuery: "deleteSection",
            saveResourceQuery: "saveSection",
            singleResourceQuery: "section",
            listResourceQuery: "sections",
            queries: {
                deleteSection: ["id"],
                saveSection: [],
                sections: [],
                section: [],
            },
            fieldsTypes: {
                id: "Int",
                name: "String",
                alias: "String",
                path: "String",
                content: "String",
                parent: "Int",
                system: "Boolean",
                has_dynamic_routes: "Boolean",
                has_indexed_filter: "Boolean",
            },
        });
    }

    /**
     * Schema for section resources
     */
    protected sectionResourcesSchema: ResourceSchema = new GenericResourceSchema({
        queries: {
            updateSectionResources: ["id", "file_ids", "gallery_ids"],
        },
        fieldsTypes: {
            id: "Int",
            file_ids: "[Int!]",
            gallery_ids: "[Int!]",
        },
    });

    constructor() {
        super(Section);
    }

    /**
     * @inheritdoc
     */
    protected getUsedEntityFields(): string[] {
        return [
            "id",
            "alias",
            "name",
            "path",
            "parent",
            "system",
            "has_dynamic_routes",
            "has_indexed_filter",
            "content",
        ];
    }

    /**
     * Returns a list of sub sections for given section
     * @param parent_section_id
     * @returns
     */
    public async getListByParent(parent_section_id: number): Promise<Section[]> {
        return this.getListByQuery(
            this.schema.getQueryMany({ parent: parent_section_id }, this.getUsedEntityFields())
        );
    }

    /**
     * Finds a section for given path
     * @param path
     * @returns
     */
    public async getByPath(path: string): Promise<Section | null> {
        return this.getOneByQuery(
            this.schema.getQueryOne({ path: path }, this.getUsedEntityFields()).take("content")
        );
    }

    /**
     * Updates section resources
     * @param section_id
     * @param files
     * @param galleries
     * @returns
     */
    public async updateSectionResources(section_id: number, files: number[], galleries: number[]): Promise<void> {
        return this.graphql_service.get(
            this.sectionResourcesSchema
                .getMutation("updateSectionResources", { id: section_id, file_ids: files, gallery_ids: galleries }, [])
        );
    }
}
