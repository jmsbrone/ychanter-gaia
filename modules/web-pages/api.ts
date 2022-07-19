import { WebPage } from "./domains/web-page";
import { CreateWebPageDto, DeleteWebPageDto, UpdateWebPageDto } from "./dto/web-page-dto";

export interface WebPagesAPI {
    /**
     * Returns a list of sub pages for given web page
     * @param parentId
     * @returns
     */
    getListByParent(parentId: number): Promise<WebPage[]>;

    /**
     * Finds a web page for given path
     * @param path
     * @returns
     */
    getByPath(path: string): Promise<WebPage | null>;

    /**
     * Finds a web page by id
     * @param id
     */
    getById(id: number): Promise<WebPage | null>;

    /**
     * Updates web page resources
     * @param webPageId
     * @param files
     * @param galleries
     * @returns
     */
    updateWebPageResources(webPageId: number, files: number[], galleries: number[]): Promise<void>;

    /**
     * Saves web page changes.
     *
     * @param saveDto
     */
    save(saveDto: CreateWebPageDto | UpdateWebPageDto): Promise<WebPage>;

    /**
     * Deletes web page.
     *
     * @param deleteDto
     */
    delete(deleteDto: DeleteWebPageDto): Promise<boolean>;
}

export interface WebPageContentManager {

}
