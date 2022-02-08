import { faChevronLeft } from "@fortawesome/free-solid-svg-icons/faChevronLeft";
import { faEdit } from "@fortawesome/free-solid-svg-icons/faEdit";
import { faPlusSquare } from "@fortawesome/free-solid-svg-icons/faPlusSquare";
import { faSadTear } from "@fortawesome/free-solid-svg-icons/faSadTear";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { faSpinner } from "@fortawesome/free-solid-svg-icons/faSpinner";
import { faList } from "@fortawesome/free-solid-svg-icons/faList";
import { faRedo } from "@fortawesome/free-solid-svg-icons/faRedo";
import { faUndo } from "@fortawesome/free-solid-svg-icons/faUndo";

export class FaIconRepository {
    get chevronLeft() {
        return faChevronLeft;
    }

    get edit() {
        return faEdit;
    }

    get plusSquare() {
        return faPlusSquare;
    }

    get sad() {
        return faSadTear;
    }

    get delete() {
        return faTrash;
    }

    get spinner() {
        return faSpinner;
    }

    get list() {
        return faList;
    }

    get undo() {
        return faUndo;
    }

    get redo() {
        return faRedo;
    }
}
