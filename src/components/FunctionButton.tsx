import { useTailwind } from "tailwind-rn";
import { Text, TouchableOpacity } from "react-native";

const FunctionButton = ({
  text,
  func,
  width,
}: {
  text: string,
  func: () => void;
  width?: number,
}) => {
  const tw = useTailwind();
  const widthStyle = { minWidth: 250, maxWidth: width || 500 };
  return (
    <TouchableOpacity
      onPress={func}
      style={{ ...tw("bg-primary rounded py-2 px-12 my-2 font-medium "), ...widthStyle }}
    >
      <Text style={tw("text-white text-center text-lg font-primary")}>{text}</Text>
    </TouchableOpacity>

  );
};

export default FunctionButton;
