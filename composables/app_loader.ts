import { Observable } from "rxjs";

export const useGlobalLoaderState = () =>
    useState("globalLoader", () => {
        return {
            open: false,
            text: "Something is happening",
            indeterminate: true,
            progressTotal: 0,
            progressCurrent: 0,
        };
    });

export function useGlobalLoader() {
    const globalLoaderState = useGlobalLoaderState();

    return {
        showBasic(text: string) {
            globalLoaderState.value.open = true;
            globalLoaderState.value.text = text;
            globalLoaderState.value.indeterminate = true;
        },
        showProgress(text: string, progressTotal: number, progressObserver: Observable<number>) {
            globalLoaderState.value.open = true;
            globalLoaderState.value.text = text;
            globalLoaderState.value.indeterminate = false;
            globalLoaderState.value.progressTotal = progressTotal;

            progressObserver.subscribe({
                next(progressMoved) {
                    globalLoaderState.value.progressCurrent += progressMoved;
                },
            });
        },
        close() {
            globalLoaderState.value.open = false;
        },
    };
}
