import { WebPage } from "./web-page";

export class WebPageTree extends WebPage {
    children: WebPageTree[] = [];
    expanded: boolean = false;
}
