import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { useTailwind } from "tailwind-rn";
import PrimaryButton from "components/PrimaryButton";
import MainTitle from "components/MainTitle";
import { useAuth } from "services/context/AuthContext";
import { useUser } from "services/context/UserContext";
import LogoutButton from "components/LogoutButton";

const MainScreen = ({ }) => {
    const tw = useTailwind();
    const { authState } = useAuth();
    const { user } = useUser();

    return (
        <View style={tw("flex-1 items-center")}>
            {!authState.isAuthenticated && <MainTitle title={"Bienvenue sur HostoMytho"} />}
            {authState.isAuthenticated && <MainTitle title={"Bonjour " + user?.username} />}

            <ScrollView style={tw('w-full')}>
                <View style={{ minWidth: 100, alignSelf: 'center' }}>
                        <PrimaryButton title="Plausibilité des textes" destination="PlausibilityGame" />
                        <PrimaryButton title="Plausibilité des textes détaillée" destination="PlausibilityGameDetailed" />
                        <PrimaryButton title="Spécifier le type des phrases" destination="TypeSentenceGame" />
                        <PrimaryButton title="Trouver les entités et expressions temporelles" destination="TemporalEntity" />
                        <PrimaryButton title="Spécifier les liens temporelles" destination="TemporalLinkGame" />
                    {!authState.isAuthenticated && 
                    <View style={tw("")}>
                        <PrimaryButton title="Connexion" destination="Login" />
                        <PrimaryButton title="Inscription" destination="SignUpScreen" />
                        <PrimaryButton title="Profil" destination="Profile" />
                    </View>
                    }
                    {authState.isAuthenticated && 
                    <View style={tw("")}>
                        <PrimaryButton title="Profil" destination="Profile" />
                        <PrimaryButton title="Paramètres" destination="Settings" />
                        <LogoutButton />
                    </View>
                    }
                </View>
            </ScrollView>
        </View>
    );
};

export default MainScreen;
