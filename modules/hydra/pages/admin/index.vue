<template lang="pug">
v-container(fluid)
    .d-flex.flex-row
        .text-h4 Modules
    v-divider.my-2

    div(v-if="hydraAuthToken")
        template(v-for="mod in modules",:key="mod.moduleId")
            .d-flex.flex-row.pa-2.align-center
                v-col(cols="2").align-center
                    v-icon(:icon="$ycIcon(isModuleInstalled(mod) ? 'module_installed' : 'module_not_installed')")
                    v-badge(
                        v-if="isModuleInstalled(mod)",
                        :content="isModuleActive(mod) ? 'active' : 'inactive'",
                        :color="isModuleActive(mod) ? 'success' : 'error'",
                        inline
                    )
                    v-badge(
                        v-else,
                        content="not installed",
                        color="info",
                        inline
                    )
                v-col(cols="4")
                    .d-flex.flex-row.align-center
                        .flex-column.mr-4
                            .text-body-1.font-weight-bold {{ mod.name }}
                            .text-subtitle-2 {{ mod.vendor }}
                        v-chip(
                            v-for="subsystemModule in mod.subsystemModules",
                            :key="subsystemModule",
                            :class="{'bg-success': subsystemModule.active}",
                            @click="isModuleInstalled(mod) ? toggleModule(mod) : null"
                        )
                            .text-body-2.font-weight-bold.mr-1 {{ subsystemModule.subsystemId }}
                            .text-subtitle {{ subsystemModule.installed ? subsystemModule.version : ''}}
                v-spacer
                v-col(cols="auto")
                    v-btn(@click="loadModuleVersions(mod)")
                        v-icon.mr-2(:icon="$ycIcon('settings')")
                        | Configure
                    v-btn(v-if="isModuleInstalled(mod)", @click="uninstallModule(mod)")
                        v-icon.mr-2(:icon="$ycIcon('delete')")
                        | Uninstall
            template(v-if="mod.versions")
                v-row(v-for="(versions, subsystemId) in mod.versions", :key="subsystemId", no-gutters).align-center
                    .mx-2 {{ subsystemId }}
                    v-divider(vertical)
                    v-select(
                        label="Module version",
                        :items="versions",
                        item-title="version",
                        item-value="version",
                        v-model="mod.selectedVersions[subsystemId]",
                        hide-details
                    )
            v-row(v-if="areModuleVersionsChanged(mod)", no-gutters).pa-2.justify-center
                v-btn(@click="applyModuleChanges(mod)") Apply changes
            v-divider.bg-secondary.my-2
    v-card(v-else)
        v-card-title.text-center Login to Hydra
        v-card-text
            v-form(v-model="valid", ref="form")
                v-row(no-gutters)
                    v-text-field(
                        v-model="formData.login",
                        :rules="rules.login",
                        label="Login",
                        :counter="10"
                    )
                v-row(no-gutters)
                    v-text-field(
                        v-model="formData.password",
                        :rules="rules.password",
                        type="password",
                        required,
                        label="Password"
                    )
                v-row(no-gutters)
                    v-spacer
                    v-btn(color="primary", @click="login()") Login
                    v-spacer
</template>

<script setup lang="ts">
import axios from "axios";
import _ from "lodash";
import type { Ref } from "vue";
import { Storage } from "../../../../core/components/storage";

definePageMeta({
    layout: "admin",
    middleware: ["auth"],
});

const hydraAuthToken = ref(Storage.take("hydra-auth-token"));
if (!hydraAuthToken.value) {
    watch(hydraAuthToken, (value) => {
        if (!value) {
            return;
        }
        getModules();
    });
} else {
    getModules();
}

const formData = reactive({
    login: "",
    password: "",
});
const rules = {
    login: [],
    password: [],
};
const valid = ref(null);
const modules: Ref<any> = ref({});

async function login() {
    const result = await axios.post("/_hydra/auth/login", formData);
    if (result.data.access_token) {
        hydraAuthToken.value = result.data.access_token;
        Storage.put("hydra-auth-token", hydraAuthToken.value);
    }
}

async function getModules() {
    const result = await axios.get("/_hydra/hub/list-modules", {
        headers: {
            Authorization: "Bearer " + hydraAuthToken.value,
        },
    });
    if (result.data) {
        modules.value = result.data;
        _.each(modules.value, (mod) => {
            mod.subsystemModules = _.keyBy(mod.subsystemModules, "subsystemId");
        });
    }
}

async function loadModuleVersions(mod) {
    const result = await axios.get("/_hydra/hub/module-versions?moduleId=" + mod.moduleId, {
        headers: {
            Authorization: "Bearer " + hydraAuthToken.value,
        },
    });
    const versions: any = {};
    _.each(result.data, (subsystemVersions, subsystemId) => {
        versions[subsystemId] = _.sortBy(subsystemVersions, "version").reverse();
    });
    mod.versions = versions;
    mod.selectedVersions = _.reduce(
        versions,
        (acc, subsystemVersions, subsystemId) => {
            let subsystemModuleVersion = null;
            _.each(subsystemVersions, (subsystemVersion) => {
                if (subsystemVersion.version == mod.subsystemModules[subsystemId].version) {
                    subsystemModuleVersion = subsystemVersion.version;
                }
            });
            if (subsystemModuleVersion == null) {
                subsystemModuleVersion = subsystemVersions[0].version;
            }

            acc[subsystemId] = subsystemModuleVersion;

            return acc;
        },
        {} as any
    );
}

function isModuleInstalled(mod) {
    let installed = true;
    _.each(mod.subsystemModules, (subsystemModule) => (installed = installed && subsystemModule.installed));

    return installed;
}

function areModuleVersionsChanged(mod) {
    let versionsChanged = false;
    _.each(mod.selectedVersions, (selectedVersion, subsystemId) => {
        versionsChanged = versionsChanged || selectedVersion !== mod.subsystemModules[subsystemId]?.version;
    });

    return versionsChanged;
}

async function applyModuleChanges(mod) {
    const dialog = useConfirmationDialog();
    const userActionConfirmation = new Promise((resolve, reject) => {
        dialog.confirm(mod.moduleId, "This will install different version of the module. Continue?", () =>
            resolve(null)
        );
    });
    userActionConfirmation.then(() => {
        const loader = useGlobalLoader();
        loader.showBasic("Applying changes to module " + mod.moduleId);

        const operation = new Promise((resolve, reject) => {
            axios
                .post(
                    `/_hydra/hub/install-module`,
                    {
                        moduleId: mod.moduleId,
                        versions: mod.selectedVersions,
                    },
                    {
                        headers: {
                            Authorization: "Bearer " + hydraAuthToken.value,
                        },
                    }
                )
                .then(() => {
                    resolve(null);
                })
                .catch(() => reject());
        });
        const notification = useAppNotification();
        operation
            .then(() => {
                _.each(
                    mod.subsystemModules,
                    (subsystemModule) => (
                        (subsystemModule.installed = true),
                        (subsystemModule.version = mod.selectedVersions[subsystemModule.subsystemId])
                    )
                );
                notification.showSuccess("Module " + mod.moduleId + " installed");
            })
            .catch(() => {
                notification.showError("Operation failed");
            })
            .finally(() => loader.close());
    });
}

async function toggleModule(mod) {
    const moduleActive = isModuleActive(mod);
    const dialog = useConfirmationDialog();
    const userActionConfirmation = new Promise((resolve, reject) => {
        dialog.confirm(
            (moduleActive ? "Deactivating" : "Activating") + " module",
            "This will " + (moduleActive ? "deactivate" : "activate") + ` module ${mod.moduleId}`,
            () => resolve(null)
        );
    });
    userActionConfirmation.then(() => {
        const loader = useGlobalLoader();
        loader.showBasic("Applying changes to module " + mod.moduleId);

        const operation = new Promise((resolve, reject) => {
            axios
                .post(
                    `/_hydra/hub/${moduleActive ? "deactivate" : "activate"}-module?moduleId=${mod.moduleId}`,
                    {},
                    {
                        headers: {
                            Authorization: "Bearer " + hydraAuthToken.value,
                        },
                    }
                )
                .then(() => {
                    resolve(null);
                })
                .catch(() => reject());
        });
        const notification = useAppNotification();
        operation
            .then(() => {
                _.each(mod.subsystemModules, (subsystemModule) => (subsystemModule.active = !moduleActive));
                notification.showSuccess("Module " + mod.moduleId + " " + (moduleActive ? "deactivated" : "activated"));
            })
            .catch(() => {
                notification.showError("Failed to apply changes");
            })
            .finally(() => loader.close());
    });
}

function isModuleActive(mod) {
    return _.reduce(
        mod.subsystemModules,
        (acc, subsystemModule) => {
            return acc && subsystemModule.active;
        },
        true
    );
}

async function uninstallModule(mod) {
    const dialog = useConfirmationDialog();
    const userActionConfirmation = new Promise((resolve, reject) => {
        dialog.confirm(mod.moduleId, "This will uninstall the module. Continue?", () => resolve(null));
    });
    userActionConfirmation.then(() => {
        const loader = useGlobalLoader();
        loader.showBasic("Uninstalling module " + mod.moduleId);

        const operation = new Promise((resolve, reject) => {
            axios
                .post(
                    `/_hydra/hub/uninstall-module`,
                    {
                        moduleId: mod.moduleId,
                    },
                    {
                        headers: {
                            Authorization: "Bearer " + hydraAuthToken.value,
                        },
                    }
                )
                .then(() => {
                    resolve(null);
                })
                .catch(() => reject());
        });
        const notification = useAppNotification();
        operation
            .then(() => {
                _.each(
                    mod.subsystemModules,
                    (subsystemModule) => ((subsystemModule.installed = false), (subsystemModule.active = false))
                );
                notification.showSuccess("Module " + mod.moduleId + " uninstalled");
            })
            .catch(() => {
                notification.showError("Operation failed");
            })
            .finally(() => loader.close());
    });
}
</script>
