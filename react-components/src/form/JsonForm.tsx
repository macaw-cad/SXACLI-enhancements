import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { JSONSchema6 } from 'json-schema';
import React from 'react';
import Form, { AjvError, WidgetProps } from 'react-jsonschema-form';
import { FieldTemplate } from './fields/FieldTemplate';
import { DefaultObjectFieldTemplate } from './fields/ObjectField';
import { RadioWidget } from './widgets/RadioWidget';
import { SelectWidget } from './widgets/SelectWidget';
import { TextWidget } from './widgets/TextWidget';
import { CheckboxesWidget } from './widgets/CheckBoxesWidget';
import { Button } from '@material-ui/core';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#4AAFE0'
        },
        secondary: {
            main: '#EDE412'
        }
    }
});

type WidgetType = 'checkboxes' | 'radiobuttons' | 'textarea';

type KeyValuePair = { [key: string]: any }

export interface Schema extends JSONSchema6 {
    widgetType?: WidgetType;
    enumNames?: string[];
    validationMessage?: string;
    classNames?: string;
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

export type JsonFormProps = {
    schema: Schema,
    formData?: KeyValuePair,
    onChange?: (formData: any) => void,
    onSubmit?: (formData: any) => void
}

export const JsonForm: React.FC<JsonFormProps> = ({ schema, formData, onChange, onSubmit }) => {
    const widgets = {
        SelectWidget: (props: WidgetProps): JSX.Element => {
            const widgetSchema = props.schema as Schema;
            if (widgetSchema.widgetType === 'radiobuttons') {
                return <RadioWidget {...props} disabled={widgetSchema.disabled || props.disabled} />;
            }

            if (widgetSchema.widgetType === 'checkboxes') {
                return <CheckboxesWidget {...props} disabled={widgetSchema.disabled || props.disabled} />;
            }

            return <SelectWidget {...props} disabled={widgetSchema.disabled || !!props.disabled} />;
        },
        TextWidget: (props: WidgetProps): JSX.Element => {
            const widgetSchema = props.schema as Schema;

            if (widgetSchema.widgetType === 'textarea') {
                return <TextWidget multiLine={true} {...props} disabled={widgetSchema.disabled || props.disabled} />
            }

            return <TextWidget {...props} disabled={widgetSchema.disabled || props.disabled} />
        }
    };

    const transformErrors = (errors: AjvError[]): AjvError[] => {
        return errors.map((error: AjvError): AjvError => {
            if (error.params.type === 'integer') {
                error.message = 'This should be a number';
            }

            if (error.params.format === 'date') {
                error.message = 'This should match the format "yyyy-mm-dd"';
            }

            const property = error.property ? error.property.replace('.', '') : error.property;
            let nestedProperties: string[] = [];

            if (property.indexOf('.') !== -1) {
                nestedProperties = property.split('.');
            }

            let schemaItem: Schema | undefined

            if (nestedProperties) {
                schemaItem = schema?.properties?.[nestedProperties[0]]?.properties?.[nestedProperties[1]];
            } else {
                schemaItem = schema?.properties?.[property];
            }

            if (schemaItem && schemaItem.validationMessage) {
                error.message = schemaItem.validationMessage;
            }

            return error;
        });
    }

    return (
        <ThemeProvider theme={theme}>
            <Form
                schema={schema}
                formData={formData}
                widgets={widgets}
                onChange={onChange}
                onSubmit={onSubmit}
                FieldTemplate={FieldTemplate}
                ObjectFieldTemplate={DefaultObjectFieldTemplate}
                transformErrors={transformErrors}
                showErrorList={false}
                noHtml5Validate={true}
            >
                <Button type="submit" variant="contained" color="secondary">Submit</Button>
            </Form>
        </ThemeProvider>
    )
}