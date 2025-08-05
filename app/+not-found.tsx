import { Link, Stack } from "expo-router";
import { StyleSheet } from "react-native";

import { Box } from "@/components/ui/box";
import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <Box className="flex-1 bg-background-0">
        <Center className="flex-1 px-5">
          <VStack space="md" className="items-center">
            <Heading size="xl" className="text-typography-900">
              This screen does not exist.
            </Heading>
            <Link href="/" style={styles.link}>
              <Text className="text-primary-600 font-semibold">
                Go to home screen!
              </Text>
            </Link>
          </VStack>
        </Center>
      </Box>
    </>
  );
}

const styles = StyleSheet.create({
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
