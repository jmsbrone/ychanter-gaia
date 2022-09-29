import _ from "lodash";
import { WebPagesAPI } from "../api";
import { WebPage } from "../domains/web-page";
import { CreateWebPageDto, UpdateWebPageDto, DeleteWebPageDto } from "../dto/web-page-dto";

/**
 * Mock implementation of web pages API that uses local repository.
 * Current implementation is not well-suited for continuous testing during
 * development as the repository is not durable and will be cleaned on every
 * instance restart (for both server and client).
 * But it can be used to test simple functionality and local repository
 * can be modified manually to reflect whatever is necessary for development.
 *
 * Note that not all backend logic is implemented. For example dynamic page
 * lookup is not supported.
 */
export class WebPageServiceMock implements WebPagesAPI {
    /**
     * Local repository array.
     * Works as runtime-only repository for web pages.
     */
    protected localRepository = [
        {
            id: 1,
            alias: "main-page",
            child_count: 0,
            content: "{}",
            depth: 0,
            name: "Home",
            parent: null,
            path: "/",
            system: true,
        },
    ];

    /** @inheritDoc */
    async getListByParent(parentId: number): Promise<WebPage[]> {
        if (parentId == 0) {
            parentId = null;
        }
        return _.filter(this.localRepository, (item) => item.parent == parentId);
    }

    /** @inheritDoc */
    async getByPath(path: string): Promise<WebPage> {
        return _.find(this.localRepository, (item) => item.path == path);
    }

    /** @inheritDoc */
    async getById(id: number): Promise<WebPage> {
        return _.find(this.localRepository, (item) => item.id == id);
    }

    /** @inheritDoc */
    async updateWebPageResources(webPageId: number, files: number[], galleries: number[]): Promise<void> {
        // do nothing as resources are not used on the client side
    }

    /** @inheritDoc */
    async save(saveDto: CreateWebPageDto & UpdateWebPageDto): Promise<WebPage> {
        let webPage: WebPage;
        if (saveDto.id) {
            webPage = _.find(this.localRepository, (item) => item.id === saveDto.id);
        } else {
            webPage = new WebPage();
            webPage.id = this.localRepository.length + 1;
            if (saveDto.parent) {
                const parentPage = await this.getById(saveDto.parent);
                webPage.path = parentPage.path + saveDto.alias + "/";
            } else {
                webPage.path = "/" + saveDto.alias + "/";
            }
            this.localRepository.push(webPage);
        }
        _.assign(webPage, saveDto);

        return webPage;
    }

    /** @inheritDoc */
    async delete(deleteDto: DeleteWebPageDto): Promise<boolean> {
        this.localRepository = _.filter(this.localRepository, (item) => item.id !== deleteDto.id);
        return true;
    }
}
