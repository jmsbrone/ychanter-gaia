import _ from "lodash";

export class ComponentLoaderHelper {
    protected static cachedPath = {};

    public static getComponentPath(name: string): string {
        if (this.cachedPath[name]) {
            return this.cachedPath[name];
        }
        const nameGroups = name.split(":");
        const module = nameGroups[0];
        return _.join(["..", "/", module, "/", nameGroups[1].replace(".", "/") + ".vue"], "");
    }

    public static getComponent(name: string): string {
        if (!this.cachedPath[name]) {
            const nameGroups = name.split(":");
            const module = nameGroups[0];
            const componentName = _.join([nameGroups[1].replace(".", "/")], "");

            this.cachedPath[name] = defineAsyncComponent(
                () => import(`./../../modules/${module}/components/${componentName}`)
            );
        }

        return this.cachedPath[name];
    }
}
