export class WebPage {
    id: number;
    name: string;
    alias: string;
    content: string;
    path: string;
    depth: number;
    parent: number;
    system: boolean;
    has_dynamic_routes: boolean;
    has_indexed_filter: boolean;
    child_count: number;
}
