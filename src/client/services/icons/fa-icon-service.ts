import { FaIconRepository } from "../../repositories/icons/fa-icon-repository";
import { IconServiceInterface } from "../../prototypes/icon-service-interface";

export class FaIconService implements IconServiceInterface {
    private repository: FaIconRepository;
    constructor() {
        this.repository = new FaIconRepository();
    }

    public getIcon(name: string) {
        switch (name) {
            case "delete":
                return this.repository.delete;
            case "edit":
                return this.repository.edit;
            case "add":
                return this.repository.plusSquare;
            case "empty":
                return this.repository.sad;
            case "back":
                return this.repository.chevronLeft;
            case "list":
                return this.repository.list;
            case "undo":
                return this.repository.undo;
            case "redo":
                return this.repository.redo;
            case "drop-zone":
                return this.repository.plusSquare;
            default:
                return this.repository.spinner;
        }
    }
}
