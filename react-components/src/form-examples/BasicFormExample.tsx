import React from 'react';
import { JsonForm } from '../form/JsonForm';
import { Schema } from '../form/JsonForm';

const schema: Schema = {
    title: "Mijn gegevens",
    type: "object",
    properties: {
        klantgegevens: {
            type: "object",
            title: "Klantgegevens",
            properties: {
                bedrijfsnaam: {
                    type: "string",
                    title: "Bedrijfsnaam"
                },
                telefoon: {
                    type: "string",
                    title: "Telefoon"
                },
                website: {
                    type: "string",
                    title: "Website"
                },
                email: {
                    type: "string",
                    title: "Email"
                }
            }
        },
        vestigingsadres: {
            type: 'object',
            title: 'Vestigingsadres',
            properties: {
                postcode: {
                    type: "string",
                    title: "Postcode"
                },
                huisnummer: {
                    type: "string",
                    title: "Huisnummer"
                },
                huisnummerToevoeging: {
                    type: "string",
                    title: "Huisnummer toevoeging"
                }
            }
        },
        postbusAdres: {
            type: 'object',
            title: 'Postbusadres',
            properties: {
                postcode: {
                    type: 'string',
                    title: 'Postcode'
                },
                straat: {
                    type: 'string',
                    title: 'Straat'
                },
                postbusnummer: {
                    type: 'string',
                    title: 'Postbusnummer'
                },
                plaats: {
                    type: 'string',
                    title: 'Plaats'
                }
            }
        },
        factuuradres: {
            type: 'string',
            title: 'Factuuradres',
            enum: ["vestiging", "postbus", "anders"],
            enumNames: [
                "Hetzelfde als vestigingsadres",
                "Hetzelfde als postbusadres",
                "Een ander adres..."
            ],
            widgetType: 'radiobuttons'
        }
    },
    dependencies: {
        factuuradres: {
            oneOf: [
                {
                    properties: {
                        factuuradres: {
                            enum: [
                                "anders"
                            ]
                        },
                        maakEenKeuze: {
                            title: "Maak een keuze:",
                            type: "string",
                            enum: ["vestigingsadres", "postbus"],
                            enumNames: ["VestigingsAdres", "Postbus"],
                            // widgetType: 'radiobuttons'
                        }
                    },
                    required: ["veld1"]
                }
            ]
        },
        maakEenKeuze: {
            oneOf: [
                {
                    properties: {
                        maakEenKeuze: {
                            enum: ["vestigingsadres"]
                        },
                        factuuradres_postcode: {
                            title: "Postcode",
                            type: "string"
                        },
                        factuuradres_huisnummer: {
                            title: "Huisnummer",
                            type: "string"
                        }
                    }
                },
                {
                    properties: {
                        maakEenKeuze: {
                            enum: ["postbus"]
                        },
                        factuuradres_postcode: {
                            title: "Postcode",
                            type: "string"
                        },
                        factuuradres_postbusnummer: {
                            title: "Postbusnummer",
                            type: "string"
                        }
                    }
                }
            ]
        }
    }
};

export const BasicFormExample: React.FC = () => {
    return (
        <JsonForm
            schema={schema}
            formData={{
                klantgegevens: {
                    bedrijfsnaam: 'macaw'
                }
            }}
        />
    );
}
