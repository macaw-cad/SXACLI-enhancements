
export type enumOption = {
    enumValue: string;
    label: string;
    value: string;
};

export type WidgetOptions = {
    enumOptions: enumOption[];
    enumDisabled: string;
    inline: boolean;
};