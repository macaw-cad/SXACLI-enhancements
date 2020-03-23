import React from "react";
import { WidgetProps } from "react-jsonschema-form";
import TextField from '@material-ui/core/TextField';

type Props = WidgetProps & {
    rawErrors?: string;
    multiLine?: boolean;
}

export const TextWidget: React.FC<Props> = ({ id,
    required,
    readonly,
    disabled,
    label,
    value,
    onChange,
    onBlur,
    onFocus,
    autofocus,
    options,
    schema,
    rawErrors,
    multiLine
}) => {

    const _onChange = ({target: { value }}: React.ChangeEvent<HTMLInputElement>) => onChange(value === '' ? options.emptyValue : value);
    const _onBlur = ({target: { value }}: React.FocusEvent<HTMLInputElement>) => onBlur(id, value);
    const _onFocus = ({target: { value }}: React.FocusEvent<HTMLInputElement>) => onFocus(id, value);

    return (
        <div>
            <TextField
                error={!!rawErrors}
                variant="outlined"
                fullWidth
                id={id}
                label={label || schema.title}
                autoFocus={autofocus}
                required={required}
                disabled={disabled || readonly}
                type={schema.type as string}
                value={value ? value : ''}
                onChange={_onChange}
                onBlur={_onBlur}
                onFocus={_onFocus}
                multiline={multiLine}
                rows={multiLine ? 4 : undefined}
            />
        </div>
    )
}