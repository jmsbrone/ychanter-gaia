import { CHILDREN_FIELD_NAME, ComponentOptions } from "client/types/editor";
import { Component, Prop, Vue } from "nuxt-property-decorator";

@Component
export class ComponentPrototype extends Vue {
    protected readonly CHILDREN_FIELD_NAME = CHILDREN_FIELD_NAME;

    @Prop()
    options: ComponentOptions;
}
