import React from 'react';
import { ObjectFieldTemplateProps } from 'react-jsonschema-form';
const AddButton = require('react-jsonschema-form/lib/components/AddButton').default;

const {
    getUiOptions,
} = require('react-jsonschema-form/lib/utils');

type ObjectFieldProps = ObjectFieldTemplateProps & {
    onChange: (params: any, errorSchema?: any) => void;
    TitleField: any;
    DescriptionField: any;
    disabled: boolean;
    readonly: boolean;
    onAddClick: (schema: any) => void;
    errorSchema: any;
    registry: any;
    idPrefix: string;
    onBlur: () => void;
    onFocus: () => void;
    name: string;
};

export function DefaultObjectFieldTemplate(props: ObjectFieldTemplateProps): JSX.Element {
    const typedProps = props as ObjectFieldProps;
    const canExpandVal = function canExpand(): any {
        const { formData, schema, uiSchema } = typedProps;
        if (!schema.additionalProperties) {
            return false;
        }
        const { expandable } = getUiOptions(uiSchema);
        if (expandable === false) {
            return expandable;
        }
        // if ui:options.expandable was not explicitly set to false, we can add
        // another property if we have not exceeded maxProperties yet
        if (schema.maxProperties !== undefined) {
            return Object.keys(formData).length < schema.maxProperties;
        }
        return true;
    };

    const { DescriptionField } = props as ObjectFieldProps;
  
    return (
        <div role="group" className="object-fieldset" aria-labelledby="fake-legend" id={typedProps.idSchema.$id}>
            {(typedProps.uiSchema['ui:title'] || typedProps.title) && (
                <div 
                    className="fake-legend" 
                    id={`${typedProps.idSchema.$id}__title`}
                >
                        {typedProps.title || typedProps.uiSchema['ui:title']}
                </div>
            )}
            {props.description && (
                <DescriptionField
                    id={`${typedProps.idSchema.$id}__description`}
                    description={typedProps.description}
                    formContext={typedProps.formContext}
                />
            )}
            {props.properties.map((prop: any) => prop.content)}
            {canExpandVal() && (
                <AddButton
                    className="object-property-expand"
                    onClick={typedProps.onAddClick(props.schema)}
                    disabled={typedProps.disabled || typedProps.readonly}
                />
            )}
        </div>
    );
}