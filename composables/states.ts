import _ from "lodash";
import { Observable } from "rxjs";
import { AppNotification } from "../core/types/app";
import { AudioFile } from "../modules/files/types/audio-file";
import { Playlist } from "../modules/files/types/playlist";

export const useCurrentUser = () => useState("currentUser", () => null);

export const useAppNotificationState = () =>
    useState<AppNotification>("notification", () => {
        return {
            open: false,
            text: "",
            type: "error",
        };
    });

export function useAppNotification() {
    const notification = useAppNotificationState();

    function showNotification(text: string, type: "success" | "info" | "warning" | "error") {
        _.assign(notification.value, { open: true, text, type });
    }

    return {
        showError(text: string) {
            showNotification(text, "error");
        },
        showSuccess(text: string) {
            showNotification(text, "success");
        },
        showInfo(text: string) {
            showNotification(text, "info");
        },
        showWarning(text: string) {
            showNotification(text, "warning");
        },
    };
}

export const useConfirmationDialogState = () =>
    useState("confirmationDialog", () => {
        return {
            open: false,
            title: "",
            text: "",
            confirmCallback: null,
            cancelCallback: null,
        };
    });

export function useConfirmationDialog() {
    return {
        confirm(title: string, text: string, confirmCallback: () => any, cancelCallback: () => any = null) {
            const confirmDialog = useConfirmationDialogState();

            _.assign(confirmDialog.value, {
                open: true,
                title,
                text,
                confirmCallback,
                cancelCallback,
            });
        },
    };
}

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

export const useGlobalPlayerState = () =>
    useState("globalPlayer", () => {
        return {
            playing: false,
            loopOne: false,
            queue: [],
            currentTrackIndex: null,
            currentPlaylist: null,
        } as {
            playing: boolean;
            loopOne: boolean;
            queue: AudioFile[];
            currentTrackIndex: number | null;
            currentPlaylist: Playlist | null;
        };
    });

export function useGlobalPlayer() {
    const globalPlayerState = useGlobalPlayerState();

    return {
        playTrackFromPlaylist(playlist: Playlist, track: AudioFile) {
            if (
                !globalPlayerState.value.currentPlaylist ||
                globalPlayerState.value.currentPlaylist.id !== playlist.id
            ) {
                globalPlayerState.value.currentPlaylist = playlist;
                globalPlayerState.value.queue = playlist.tracks;
            }

            globalPlayerState.value.currentTrackIndex = _.findIndex(
                globalPlayerState.value.queue,
                (queueTrack) => queueTrack.file.id === track.file.id
            );
            globalPlayerState.value.playing = true;
        },
    };
}
