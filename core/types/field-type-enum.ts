export enum FieldType {
    // 0x000* general fields
    string = 0x0000,
    number = 0x0001,
    color = 0x0002,
    text = 0x0003,
    wysiwyg = 0x0004,
    array = 0x0005,
    complex = 0x0006,
    entity = 0x0007,
    switch = 0x0008,
    checkbox = 0x0009,
    password = 0x000a,
    hidden = 0x000b,
    gallery = 0x000c,
    web_page = 0x000d,
    autocomplete = 0x000e,
    timestamp = 0x000f,
    select = 0x0010,

    // 0x01** file fields
    // File type can be used for general check for all files
    // Like (type & FieldType.file)
    file = 0x0100,
    image = 0x0101,
    audio = 0x0102,
}
