import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useAuth } from "@/lib/authContext";
import React from "react";

export default function Dashboard() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // This component is only rendered when user is authenticated (protected route)
  if (!user) {
    return null;
  }

  return (
    <Center className="flex-1 px-4">
      <VStack space="xl" className="w-full max-w-sm">
        <VStack space="md">
          <Heading size="xl" className="text-center">
            Добре дошли!
          </Heading>
          <Text className="text-center text-muted-foreground">
            Успешно сте влезли в системата
          </Text>
        </VStack>

        <VStack space="md" className="w-full">
          <Box className="w-full p-4 bg-background border rounded-lg">
            <VStack space="sm">
              <Text className="font-semibold">Информация за потребителя:</Text>
              <Divider />
              <HStack space="sm" className="justify-between">
                <Text>Имейл:</Text>
                <Text className="font-medium">{user.email}</Text>
              </HStack>
              <HStack space="sm" className="justify-between">
                <Text>Роля:</Text>
                <Text className="font-medium">{user.role}</Text>
              </HStack>
              <HStack space="sm" className="justify-between">
                <Text>ID:</Text>
                <Text className="font-medium">{user.id}</Text>
              </HStack>
            </VStack>
          </Box>

          <Button variant="outline" onPress={handleLogout} className="w-full">
            <Text>Излез от системата</Text>
          </Button>
        </VStack>
      </VStack>
    </Center>
  );
}
