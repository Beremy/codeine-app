import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Text, View, Dimensions } from 'react-native';
import { useTailwind } from 'tailwind-rn';
import withAuth from 'services/context/withAuth';
import { useUser } from 'services/context/UserContext';
import { Skin } from 'models/Skin';
import { getUserSkins, unequipSkin, equipSkin } from 'services/api/skins';
import SkinImage from 'components/SkinImage';
import { getRarityColorWithOpacity } from 'utils/functions';

const SkinsManagementScreen = (props: any) => {
    const tw = useTailwind();
    const { user, updateStorageUserFromAPI, equippedSkins, setEquippedSkins } = useUser();
    const window = Dimensions.get('window');
    const isMobile = window.width < 670;
    const skinTypes = ["Visages", "Lunettes", "Chapeaux", "Vestes", "Cheveux", "Accessoires"];
    const [skins, setSkins] = useState<Skin[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            if (user?.id) {
                const allSkins = await getUserSkins(user.id);
                setSkins(allSkins);
            }
        };
        fetchData();
    }, [user]);

    const clickOnSkin = async (skin: Skin) => {
        if (user?.id) {
            if (isEquipped(skin)) {
                const sameTypeEquippedSkins = equippedSkins.filter(s => s.type === skin.type);

                // Vérification qu'un visage est équippé
                if (sameTypeEquippedSkins.length > 1 || skin.type !== 'Visages') {
                    const updatedSkin = await unequipSkin(skin.id);
                    const updatedEquippedSkins = equippedSkins.filter(s => s.id !== updatedSkin.id);
                    setEquippedSkins(updatedEquippedSkins);
                }
            } else {
                const updatedSkin = await equipSkin(skin.id);
                setEquippedSkins([...equippedSkins, updatedSkin]);
            }

            if (user?.id) {
                updateStorageUserFromAPI(user.id);
            }
        }
    };

    const isEquipped = (skin: Skin) => {
        return equippedSkins.some(equippedSkin => equippedSkin.id === skin.id);
    };

    return (
        <View style={[tw('w-full mt-4 px-2'), isMobile ? tw('pt-2') : tw('pt-6')]}>

            <View style={[tw('flex-row justify-center'), isMobile ? tw('w-full') : tw('w-4/5')]}>
                <View style={tw('mt-4')}>
                    <Text style={[tw('font-bold mb-6 text-center text-[whitesmoke] font-MochiyPopOne'), isMobile ? tw('text-xl') : tw(' text-3xl leading-10')]}>Changement d'apparence</Text>
                </View>
            </View>

            <View style={tw('flex-col')}>
                <View style={[tw('justify-between my-6 flex-wrap  '), isMobile ? tw('flex-col mt-2') : tw('flex-row mt-8')]}>
                    <View style={[tw('mt-0'), isMobile ? tw('w-full mr-0 mb-4') : tw('w-3/4 mr-2')]}>
                        <Text style={tw('text-xl font-bold mb-2 pl-2 text-white font-primary')}>Objets possédés</Text>

                        {skinTypes.map(type => {
                            return (
                                <View key={type} style={tw('bg-white mb-2 py-2 rounded-lg')}>
                                    <View>
                                        <Text style={tw('text-xl font-bold mb-2 pl-2 text-black font-primary')}>{type}</Text>
                                        <View style={tw('flex-row flex-wrap')}>

                                            {/* @ts-ignore */}
                                            {skins[type]?.map((skin: Skin) => {
                                                return (
                                                    <TouchableOpacity
                                                        key={`skin-${skin.id}`}
                                                        style={[
                                                            tw('rounded-lg mb-2 overflow-hidden h-16'),
                                                            { backgroundColor: getRarityColorWithOpacity(skin.rarity) },
                                                            isEquipped(skin) ? tw('border-2 border-blue-500') : tw('border-2 border-transparent')
                                                        ]}
                                                        onPress={() => clickOnSkin(skin)}
                                                    >
                                                        <SkinImage skin={skin} />
                                                    </TouchableOpacity>
                                                );
                                            })}
                                        </View>
                                    </View>
                                </View>);
                        })}
                        <View style={tw('bg-white mb-2 py-2 rounded-lg')}>
                            <View style={tw('flex-row justify-center my-4')}>
                                <View style={tw('flex-row items-center mr-4')}>
                                    <View style={[tw('w-5 h-5 rounded-full'), { backgroundColor: '#3866C533' }]} />
                                    <Text style={tw('ml-2 text-black font-primary')}>Peu commune</Text>
                                </View>
                                <View style={tw('flex-row items-center mr-4')}>
                                    <View style={[tw('w-5 h-5 rounded-full'), { backgroundColor: '#5d06b933' }]} />
                                    <Text style={tw('ml-2 text-black font-primary')}>Rare</Text>
                                </View>
                                <View style={tw('flex-row items-center')}>
                                    <View style={[tw('w-5 h-5 rounded-full'), { backgroundColor: '#fd8f2d33' }]} />
                                    <Text style={tw('ml-2 text-black font-primary')}>Très rare</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={[tw('flex-1'), isMobile ? tw('') : tw('mr-2')]}>
                    </View>
                </View>
            </View>
        </View>

    );
};


export default withAuth(SkinsManagementScreen);