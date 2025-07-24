import { AuthForm } from "@/components/AuthForm";
import { useLocalSearchParams } from "expo-router";

export default function HomeScreen() {
  const params = useLocalSearchParams();

  return <AuthForm />;
}
