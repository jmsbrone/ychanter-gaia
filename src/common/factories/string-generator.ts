import rnd_string from "random-string";

export class StringGenerator {
    public static createRandom(length = 16): string {
        return rnd_string({ length: length });
    }
}
