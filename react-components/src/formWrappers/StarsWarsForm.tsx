import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { JsonForm, Schema } from '../form/JsonForm';
import { FormProps } from 'react-jsonschema-form';


export const StarWarsForm: React.FC = () => {
    const [formData, setFormData] = useState<any>();

    const [schema, setSchema] = useState<Schema>({
        title: 'Starwars form',
        type: 'object',
        properties: {
            character: {
                type: 'string'
            },
            planets: {
                type: 'string'
            }
        }
    });

    useEffect(
        () => {
            async function getAndSetCharacters() {
                const starwarsCharacters = await axios.get('https://swapi.co/api/people/') as { data: { results: any[] } };
                const enums = starwarsCharacters.data.results.map(char => char.name);

                setSchema({
                    ...schema,
                    properties: {
                        ...schema.properties,
                        character: {
                            ...schema.properties?.character,
                            enum: enums
                        }
                    }
                });
            }      
            getAndSetCharacters();      
        }, 
        []
    );

    async function getAndSetPlanets(character: string | undefined) {
        if (!character) {
            return;
        }

        if (character === 'Owen Lars') {
            const planets = await axios.get('https://swapi.co/api/planets/') as { data: { results: any[] } };
            const enums = planets.data.results.map(planet => planet.name);

            setSchema({
                ...schema,
                properties: {
                    ...schema.properties,
                    planets: {
                        ...schema.properties?.planets,
                        enum: enums
                    }
                }
            });
        } else {
            const planets = await axios.get('https://swapi.co/api/planets/2') as { data: any };
            const enums = [planets.data.name]

            setSchema({
                ...schema,
                properties: {
                    ...schema.properties,
                    planets: {
                        ...schema.properties?.planets,
                        enum: enums
                    }
                }
            });
        }
    }   

    useEffect(
        () => {
            console.log('formData', formData);
            if (formData) {
                getAndSetPlanets(formData.character);
            }
        },
        [formData]
    )

    return (
        <JsonForm
            schema={schema}
            formData={formData}
            onChange={(data) => {
                const dataCasted = data as FormProps<any>;
                setFormData(dataCasted.formData);
                // setSelectedCharacter(dataCasted.formData.character);
            }}
        />
    )
}