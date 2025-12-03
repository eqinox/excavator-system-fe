import AuthenticationForm from "@/components/forms/AuthenticationForm";

export default function AuthScreen() {
  // const router = useRouter();
  // const isAuthenticated = useSelector((state: RootState) => {
  //   return state.auth.isAuthenticated;
  // });

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     // If user is already authenticated, redirect to categories
  //     // No matter if its with (private) or wihtout.
  //     router.replace("/(private)/categories");
  //   }
  // }, [isAuthenticated, router]);

  // if (isAuthenticated) {
  //   return (
  //     <Center className="flex-1">
  //       <Text>Пренасочване...</Text>
  //     </Center>
  //   );
  // }

  return <AuthenticationForm />;
}
