export class UpdateSectionDto {
    public id: number;
    public name?: string;
    public alias?: string;
    public content?: string;
    public parent?: number;
    public system?: boolean;
    public has_dynamic_routes?: boolean;
    public has_indexed_filter?: boolean;
    public path?: string;
}
