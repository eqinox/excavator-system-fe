import Categories from "@/components/Categories";
import { Center } from "@/components/ui/center";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/lib/authContext";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function CategoriesRoute() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If not loading and no user, redirect to login
    if (!isLoading && !user) {
      router.replace("/");
    }
  }, [user, isLoading, router]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <Center className="flex-1">
        <Text>Зареждане...</Text>
      </Center>
    );
  }

  // If no user, show loading (will redirect)
  if (!user) {
    return (
      <Center className="flex-1">
        <Text>Пренасочване...</Text>
      </Center>
    );
  }

  // User is authenticated, show categories
  return <Categories />;
}
