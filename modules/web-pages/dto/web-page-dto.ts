export class CreateWebPageDto {
    public name: string;
    public alias: string;
    public parent: number;
}
export class UpdateWebPageDto {
    public id: number;
    public name?: string;
    public alias?: string;
    public content?: string;
    public parent?: number;
    public system?: boolean;
    public path?: string;
}
export class DeleteWebPageDto {
    id: number;
}
