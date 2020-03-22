import * as React from 'react';
const IconButton = require('react-jsonschema-form/lib/components/IconButton');

type LabelProps = {
    label: string;
    required: boolean;
    id: string;
    secondaryDescription?: string;
};

const Label: React.FC<LabelProps> = ({ label, required, id, secondaryDescription }) => {
    if (!label) {
        return null;
    }
    return (
        <label className="control-label" htmlFor={id}>
            {label}

            {required && <span className="required">*</span>}
        </label>
    );
};

type LabelInputProps = {
    id: string;
    label: string;
    onChange: (value: string) => void;
    required: boolean;
};

const LabelInput: React.FC<LabelInputProps> = (props: LabelInputProps) => {
    const { id, label, onChange } = props;
    return (
        <input
            className="form-control"
            type="text"
            id={id}
            onBlur={event => onChange(event.target.value)}
            defaultValue={label}
        />
    );
};

type WrapIfAdditionalProps = {
    id: string;
    classNames: string;
    disabled: boolean;
    label: string;
    onKeyChange: () => void;
    onDropPropertyClick: (value: string) => void;
    readonly: boolean;
    required: boolean;
    schema: any;
};

const WrapIfAdditional: React.FC<WrapIfAdditionalProps> = ({ id, children, classNames, disabled, label, onKeyChange, onDropPropertyClick, readonly, required, schema }) => {

    const keyLabel = `${label} Key`; // i18n ?
    const additional = schema.hasOwnProperty(undefined);

    const allClassNames = `${classNames} ${schema.classNames ? schema.classNames : ''}`;

    if (!additional) {
        return <div className={allClassNames}>{children}</div>;
        // return <>{children}</>
    }

    return (
        <div className={allClassNames}>
            <div className="row">
                <div className="col-xs-5 form-additional">
                    <div className="form-group">
                        <Label label={keyLabel} required={required} id={`${id}-key`} secondaryDescription={schema.secondaryDescription} />
                        <LabelInput
                            label={label}
                            required={required}
                            id={`${id}-key`}
                            onChange={onKeyChange}
                        />
                    </div>
                </div>
                <div className="form-additional form-group col-xs-5">
                    {children}
                </div>
                <div className="col-xs-2">
                    <IconButton
                        type="danger"
                        icon="remove"
                        className="array-item-remove btn-block"
                        tabIndex="-1"
                        style={{ border: '0' }}
                        disabled={disabled || readonly}
                        onClick={onDropPropertyClick(label)}
                    />
                </div>
            </div>
        </div>
    );
};

export const FieldTemplate: React.FC<any> = (props) => {
    const {
        children,
        errors,
        help,
        description,
        hidden,
        displayLabel,
        schema
    } = props;
    
    if (hidden || schema.hidden) {
        return <div className="hidden">{children}</div>;
    }

    return (
        <WrapIfAdditional {...props}>
            {displayLabel && description ? description : null}
            {children}
            {errors}          
            {help}
        </WrapIfAdditional>
    );
};

