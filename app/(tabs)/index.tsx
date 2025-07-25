import { AuthForm } from "@/components/AuthForm";
import Dashboard from "@/components/Dashboard";
import { Center } from "@/components/ui/center";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/lib/authContext";
import React from "react";

export default function TabOneScreen() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Center className="flex-1">
        <Text>Зареждане...</Text>
      </Center>
    );
  }

  // Show dashboard if user is authenticated, otherwise show auth form
  return user ? <Dashboard /> : <AuthForm />;
}
