import { TestPlausibilityError } from 'models/TestPlausibilityError';
import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { getTestPlausibilityErrorByTextId } from 'services/api/plausibility';
// import { getTestSpecificationsByTextId } from 'services/api/testSpecifications';
import { useTailwind } from "tailwind-rn";

interface InfoTextProps {
    textId: number;
    num: string;
    origin?: string;
    test_plausibility?: number;
    is_plausibility_test?: boolean;
    is_negation_test?: boolean;
    idUserErrorDetail?: number;
    vote_weight?: number;
}

interface TestSpecification {
    content: string;
}

const InfoText: React.FC<InfoTextProps> = ({ num, origin, test_plausibility, is_plausibility_test, is_negation_test, textId, idUserErrorDetail, vote_weight }) => {
    const [isInfoVisible, setInfoVisible] = useState(false);
    // const [testSpecifications, setTestSpecifications] = useState<TestSpecification[]>([]);
    const [testPlausibilityError, setTestPlausibilityError] = useState<TestPlausibilityError[]>([]);
    const tw = useTailwind();

    useEffect(() => {
        const fetchSpecifications = async () => {
            if (is_negation_test) {
                try {
                    // const specifications = await getTestSpecificationsByTextId(textId, 'negation');
                    // setTestSpecifications(specifications);
                } catch (error) {
                    console.error(error);
                }
            }
            if (is_plausibility_test) {
                try {
                    const testPlausibilityError = await getTestPlausibilityErrorByTextId(textId);
                    setTestPlausibilityError(testPlausibilityError);
                } catch (error) {
                    console.error(error);
                }
            }
        };

        fetchSpecifications();
    }, [is_negation_test, textId]);

    return (
        <View style={tw('mb-2 mx-2 items-start')}>
            <TouchableOpacity
                style={tw('py-1 px-2 border-b-2 border-blue-800 bg-blue-100 bg-opacity-70')}
                onPress={() => setInfoVisible(!isInfoVisible)}
            >
                <Text style={tw('text-blue-800 font-primary text-lg')}>{isInfoVisible ? 'Cacher les infos' : 'Afficher les infos du texte'}</Text>
            </TouchableOpacity>

            {isInfoVisible && (
                <View style={tw('p-2 mt-1 bg-gray-100 rounded items-start')}>
                    <Text style={tw('mb-1 text-sm')}>textId : {textId}</Text>
                    <Text style={tw('mb-1 text-sm')}>Num : {num}</Text>
                    {origin && <Text style={tw('mb-1 text-sm')}>Origine : {origin}</Text>}
                    {is_plausibility_test && <Text style={tw('mb-1 text-sm')}>C'est un test de plausibilité</Text>}
                    {/* {idUserErrorDetail && <Text style={tw('mb-1 text-sm')}>C'est une erreur de test</Text>} */}
                    {vote_weight && <Text style={tw('mb-1 text-sm')}>Poids de l'erreur : {vote_weight}</Text>}
                    {is_plausibility_test && (
                        <Text style={tw('mb-1 text-sm')}>Taux de plausibilité: {test_plausibility}</Text>
                    )}

                    {is_plausibility_test && (
                        <>
                            {testPlausibilityError.length > 0 && (
                                <>
                                    <Text style={tw('mb-1 text-sm')}>Les erreurs à trouver sont:</Text>
                                    {testPlausibilityError.map((spec, index) => (
                                        <Text key={index} style={tw('ml-2 mb-1 text-sm')}>- {spec.content}</Text>
                                    ))}
                                </>
                            )}
                        </>
                    )}

                    {is_negation_test && (
                        <>
                            <Text style={tw('mb-1 text-sm')}>C'est un test de négation</Text>
                            {/* {testSpecifications.length > 0 && (
                                <>
                                    <Text style={tw('mb-1 text-sm')}>Les négations à trouver sont:</Text>
                                    {testSpecifications.map((spec, index) => (
                                        <Text key={index} style={tw('ml-2 mb-1 text-sm')}>- {spec.content}</Text>
                                    ))}
                                </>
                            )} */}
                        </>
                    )}
                </View>
            )}
        </View>
    );

};

export default InfoText;
