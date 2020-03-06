import React from "react";

import { asNumber, guessType } from "react-jsonschema-form/lib/utils";
import { Schema } from "../JsonForm";
import { WidgetProps } from "react-jsonschema-form";

const nums = new Set(["number", "integer"]);

/**
 * This is a silly limitation in the DOM where option change event values are
 * always retrieved as strings.
 */
function processValue(schema: Schema, value: any) {
  // "enum" is a reserved word, so only "type" and "items" can be destructured
  const { type, items } = schema;
  if (value === "") {
    return undefined;
  // @ts-ignore
  } else if (type === "array" && items && nums.has(items.type)) {
    return value.map(asNumber);
  } else if (type === "boolean") {
    return value === "true";
  } else if (type === "number") {
    return asNumber(value);
  }

  // If type is undefined, but an enum is present, try and infer the type from
  // the enum values
  if (schema.enum) {
    if (schema.enum.every(x => guessType(x) === "number")) {
      return asNumber(value);
    } else if (schema.enum.every(x => guessType(x) === "boolean")) {
      return value === "true";
    }
  }

  return value;
}

function getValue(event: any, multiple: boolean | undefined) {
  if (multiple) {
    return [].slice
      .call(event.target.options)
      // @ts-ignore
      .filter(o => o.selected)
      // @ts-ignore
      .map(o => o.value);
  } else {
    return event.target.value;
  }
}

type SelectProps = WidgetProps & {
    multiple?: boolean;
}

export function SelectWidget(props: SelectProps) {
  const {
    schema,
    id,
    options,
    value,
    required,
    disabled,
    readonly,
    multiple,
    autofocus,
    onChange,
    onBlur,
    onFocus,
    placeholder,
  } = props;
  const { enumOptions, enumDisabled } = options;
  const emptyValue = multiple ? [] : "";
  return (
    <select
      id={id}
      multiple={multiple}
      className="form-control custom-select-widget"
      value={typeof value === "undefined" ? emptyValue : value}
      required={required}
      disabled={disabled || readonly}
      autoFocus={autofocus}
      onBlur={
        onBlur &&
        (event => {
          const newValue = getValue(event, multiple);
          // @ts-ignore
          onBlur(id, processValue(schema, newValue));
        })
      }
      onFocus={
        onFocus &&
        (event => {
          const newValue = getValue(event, multiple);
          // @ts-ignore
          onFocus(id, processValue(schema, newValue));
        })
      }
      onChange={event => {
        const newValue = getValue(event, multiple);
        // @ts-ignore
        onChange(processValue(schema, newValue));
      }}>
      {!multiple && schema.default === undefined && (
        <option value="">{placeholder}</option>
      )}
      {/* 
        // @ts-ignore */}
      {enumOptions.map(({ value, label }, i) => {
       
        const disabled = typeof enumDisabled === 'string' && enumDisabled.indexOf(value) !== -1;
        
        return (
          <option key={i} value={value} disabled={!!disabled}>
            {label}
          </option>
        );
      })}
    </select>
  );
}