import { EntityServicePrototype } from "client/prototypes/entity-service-prototype";
import { CreateSectionDto } from "common/dto/section/create-section.dto";
import { DeleteSectionDto } from "common/dto/section/delete-section-dto";
import { UpdateSectionDto } from "common/dto/section/update-section.dto";
import { Mutation } from "common/lib/graphql/mutation";
import { Query } from "common/lib/graphql/query";
import { Section } from "../domains/section";

export class SectionService extends EntityServicePrototype<
    Section,
    CreateSectionDto,
    UpdateSectionDto,
    DeleteSectionDto
> {
    constructor() {
        super(Section, "section", "sections", "createSection", "updateSection", "deleteSection");
    }

    protected getUsedEntityFields(): string[] {
        return ["id", "alias", "name", "path", "parent", "system", "has_dynamic_routes", "has_indexed_filter"];
    }

    protected getEntityFieldGraphQLTypes(): {
        id?: string;
        name?: string;
        alias?: string;
        content?: string;
        path?: string;
        parent?: string;
        system?: string;
        has_dynamic_routes?: string;
        has_indexed_filter?: string;
    } {
        return {
            id: "Int!",
            name: "String!",
            alias: "String!",
            path: "String!",
            content: "String!",
            parent: "Int",
            system: "Boolean!",
            has_dynamic_routes: "Boolean!",
            has_indexed_filter: "Boolean!",
        };
    }

    /**
     * Returns a list of sub sections for given section
     * @param parent_section_id
     * @returns
     */
    public async getListByParent(parent_section_id: number): Promise<Section[]> {
        const query = new Query("sections", "sectionListByParent")
            .with({
                parentId: parent_section_id,
            })
            .take(...this.getUsedEntityFields());

        return this.getListByQuery(query);
    }

    /**
     * Finds a section for given path
     * @param path
     * @returns
     */
    public async getByPath(path: string): Promise<Section | null> {
        const query = new Query("section", "sectionByPath")
            .with({
                path: "$path",
            })
            .vars({
                path: {
                    type: "String",
                    value: path,
                },
            })
            .take(...this.getUsedEntityFields(), "content");

        return this.getOneByQuery(query);
    }

    /**
     * Updates section resources
     * @param section_id
     * @param files
     * @param galleries
     * @returns
     */
    public async updateSectionResources(section_id: number, files: number[], galleries: number[]): Promise<void> {
        const query = new Mutation("updateSectionResources")
            .with({ section_id, file_ids: "$files", gallery_ids: "$galleries" })
            .vars({
                files: {
                    value: files,
                    type: "[Int!]!",
                },
                galleries: {
                    value: galleries,
                    type: "[Int!]!",
                },
            })
            .take("id");

        return this.graphql_service.get(query);
    }
}
