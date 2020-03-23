import React from 'react';
import { JsonForm, Schema } from '../form/JsonForm';
import Axios from 'axios';

const schema: Schema = {
    type: "object",
    properties: { 
        customerDetails: {
            type: "object",
            title: "Customer details",
            properties: {
                companyName: {
                    type: "string",
                    title: "Company name",
                    classNames: "full-width"
                },
                telephone: {
                    type: "string",
                    title: "Telephone"
                },
                website: {
                    type: "string",
                    title: "Website"
                },
                email: {
                    type: "string",
                    title: "Email"
                },
                dropdown: {
                    type: "string",
                    title: "Dropdown",
                    enum: ['value1', 'value2', 'value3'],
                    enumNames: ['value 1', 'value 2', 'value 3']
                },
                checkboxes: {
                    type: "array",
                    title: "Checkboxes",
                    widgetType: 'checkboxes',
                    "uniqueItems": true,
                    items: {
                        type: 'string',
                        enum: ['value1', 'value2', 'value3']
                    }
                },
                radiobuttons: {
                    type: "string",
                    title: "Radiobuttons",
                    widgetType: 'radiobuttons',
                    enum: ['value1', 'value2', 'value3'],
                    enumNames: ['value 1', 'value 2', 'value 3']
                },
                textarea: {
                    type: "string",
                    title: "textarea",
                    widgetType: 'textarea'
                }
            },
            required: ['dropdown', 'checkboxes', 'radiobuttons']
        },
        primaryAddress: {
            type: 'object',
            title: 'Primary address',
            properties: {
                postcode: {
                    type: "string",
                    title: "Postcode",
                    pattern: "[0-9]{4}[A-Z]{2}",
                    validationMessage: "Postcode format is incorrect, (e.g. 1234AB)"
                },
                houseNumber: {
                    type: "string",
                    title: "House number"
                },
            },
            required: ['postcode']
        },
        deliveryAddress: {
            type: 'object',
            title: 'Delivery address',
            properties: {
                postcode: {
                    type: 'string',
                    title: 'Postcode'
                },
                street: {
                    type: 'string',
                    title: 'street'
                },
                city: {
                    type: 'string',
                    title: 'City'
                }
            }
        },
        billingAddress: {
            type: 'string',
            title: 'Billing address',
            enum: ["primaryAddress", "DeliveryAddress", "other"],
            enumNames: [
                "Same as primary address",
                "Same as delivery address",
                "Other"
            ],
            widgetType: 'radiobuttons'
        }
    },
    dependencies: {
        billingAddress: {
            oneOf: [
                {
                    properties: {
                        billingAddress: {
                            enum: [
                                "other"
                            ]
                        },
                        billingAddressOther: {
                            title: "Other address",
                            type: "string",
                            enum: ["entityAddress", "trustAddress"],
                            enumNames: ["Entity address", "Trust address"],
                            widgetType: 'radiobuttons'
                        }
                    }
                }
            ]
        },
        billingAddressOther: {
            oneOf: [
                {
                    properties: {
                        billingAddressOther: {
                            enum: ["entityAddress"]
                        },
                        billingAddressOther_postcode: {
                            title: "Postcode",
                            type: "string"
                        },
                        billingAddressOther_houseNumber: {
                            title: "House number",
                            type: "string"
                        }
                    }
                },
                {
                    properties: {
                        billingAddressOther: {
                            enum: ["trustAddress"]
                        },
                        billingAddressOther_postcode: {
                            title: "Postcode",
                            type: "string"
                        },
                        billingAddressOther_postboxNumber: {
                            title: "Postbox number",
                            type: "string"
                        }
                    }
                }
            ]
        }
    }
}

const formData = {
    customerDetails: {
        companyName: 'Macaw'
    }
}

export const OrganizationInformationForm: React.FC = () => {
    const onSubmit = () => {
        // handle submit
    }

    return (
        <JsonForm
            schema={schema}
            formData={formData}
            onSubmit={onSubmit}
        />
    );
}
