import { useTailwind } from "tailwind-rn";
import { Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const PrimaryButton = ({
  title,
  destination,
  props,
}: {
  title: string;
  destination: any;
  props?: any;
}) => {
  const tw = useTailwind();
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      // @ts-ignore
      onPress={() => navigation.navigate(destination)}
      style={tw("bg-secondary py-2 px-12 my-2 font-medium rounded-xl")}
    >
      <Text style={[tw("text-white text-center text-lg"), { cursor: 'pointer' }]}>{title}</Text>
    </TouchableOpacity>

  );
};

export default PrimaryButton;
