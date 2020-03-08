import React from 'react';
import Form, { WidgetProps } from 'react-jsonschema-form';
import { JSONSchema6 } from 'json-schema';

// TODO: fix types
// @ts-ignore
import RadioWidget from 'react-jsonschema-form/lib/components/widgets/RadioWidget';

// @ts-ignore
import CheckBoxesWidget from 'react-jsonschema-form/lib/components/widgets/CheckboxesWidget';

import { SelectWidget } from './widgets/SelectWidget';

type WidgetType = 'checkboxes' | 'radiobuttons' | 'textarea';

type KeyValuePair = { [key: string]: any }

export interface Schema extends JSONSchema6 {
    widgetType?: WidgetType;
    enumNames?: string[];
    validationMessage?: string;
    disabled?: boolean;
    properties?: {
      [k: string]: Schema;
    };
    definitions?: {
      [k: string]: Schema;
    };
    dependencies?: {
      [k: string]: Schema;
    };
    oneOf?: Schema[]
}

type JsonFormProps = {
    schema: Schema,
    formData?: KeyValuePair,
    onChange?: (formData: any) => void
}

export const JsonForm: React.FC<JsonFormProps> = ({schema, formData, onChange}) => {
    const widgets = {
        SelectWidget: (props: WidgetProps): JSX.Element => {
            const widgetSchema = props.schema as Schema;
           
            if (widgetSchema.widgetType === 'radiobuttons') {
                return <RadioWidget {...props} disabled={widgetSchema.disabled} />;
            }

            if (widgetSchema.widgetType === 'checkboxes') {
                return <CheckBoxesWidget {...props} disabled={widgetSchema.disabled} />;
            }

            return <SelectWidget {...props} disabled={widgetSchema.disabled || props.disabled} />;
        },
    }

    return (
        <Form 
            schema={schema} 
            formData={formData}
            widgets={widgets}
            onChange={onChange}
        />
    )
}