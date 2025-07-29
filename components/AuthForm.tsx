import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Divider } from "@/components/ui/divider";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { EyeIcon, EyeOffIcon, Icon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useAuth } from "@/lib/authContext";
import {
  loginSchema,
  signupSchema,
  type LoginFormData,
  type SignupFormData,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface AuthFormProps {
  onSuccess?: () => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onSuccess }) => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(params.mode !== "signup");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use React Hook Form with Zod resolver
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<LoginFormData | SignupFormData>({
    resolver: zodResolver(isLogin ? loginSchema : signupSchema),
    mode: "onChange", // Real-time validation for password fields
  });

  const watchedPassword = watch("password");

  // Update form when mode changes
  useEffect(() => {
    const newMode = params.mode === "signup" ? false : true;
    setIsLogin(newMode);
    setHasAttemptedSubmit(false);
    setError(null);
    reset(); // Reset form when switching modes
  }, [params.mode, reset]);

  const onSubmit = async (data: LoginFormData | SignupFormData) => {
    setHasAttemptedSubmit(true);
    setIsSubmitting(true);
    setError(null);

    try {
      if (isLogin) {
        await login({
          email: data.email,
          password: data.password,
        });
      } else {
        await register({
          email: data.email,
          password: data.password,
          username: (data as SignupFormData).username || undefined,
        });
        // After successful registration, you might want to auto-login
        // or show a success message
      }

      // Call success callback or navigate
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      setError(error.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    const newMode = !isLogin;
    setIsLogin(newMode);
    setHasAttemptedSubmit(false);
    setError(null);
    reset();

    // Navigate to the appropriate route
    const route = newMode ? "/" : "/?mode=signup";
    router.replace(route);
  };

  // Type-safe error access
  const getFieldError = (fieldName: string) => {
    return (errors as any)[fieldName]?.message;
  };

  // Show email error only when submit button has been pressed
  const shouldShowEmailError = () => {
    return hasAttemptedSubmit && !!getFieldError("email");
  };

  return (
    <Center className="flex-1 px-4">
      <Box className="w-full max-w-sm rounded-lg bg-background-0 p-6 shadow-md">
        <VStack space="md">
          <Center>
            <Heading size="xl" className="text-typography-900">
              {isLogin ? "Добре дошли отново" : "Създаване на акаунт"}
            </Heading>
            <Text className="mt-2 text-typography-600">
              {isLogin
                ? "Влезте в акаунта си"
                : "Регистрирайте се, за да започнете"}
            </Text>
          </Center>

          {/* Global error message */}
          {error && (
            <Box className="bg-error-50 border border-error-200 rounded-md p-3">
              <Text className="text-error-600 text-sm">{error}</Text>
            </Box>
          )}

          <VStack space="md" className="mt-6">
            {/* Email Field */}
            <FormControl isInvalid={!!getFieldError("email")}>
              <FormControlLabel>
                <FormControlLabelText>Имейл</FormControlLabelText>
              </FormControlLabel>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input variant="outline" size="md">
                    <InputField
                      placeholder="Въведете вашия имейл"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      returnKeyType="next"
                    />
                  </Input>
                )}
              />
              <FormControlError>
                <FormControlErrorText>
                  {getFieldError("email")}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>

            {/* Username Field (only for signup) */}
            {!isLogin && (
              <FormControl isInvalid={!!getFieldError("username")}>
                <FormControlLabel>
                  <FormControlLabelText>
                    Потребителско име (по желание)
                  </FormControlLabelText>
                </FormControlLabel>
                <Controller
                  control={control}
                  name="username"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input variant="outline" size="md">
                      <InputField
                        placeholder="Въведете потребителско име"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        autoCapitalize="none"
                        returnKeyType="next"
                      />
                    </Input>
                  )}
                />
                <FormControlError>
                  <FormControlErrorText>
                    {getFieldError("username")}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
            )}

            {/* Password Field */}
            <FormControl isInvalid={!!getFieldError("password")}>
              <FormControlLabel>
                <FormControlLabelText>Парола</FormControlLabelText>
              </FormControlLabel>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input variant="outline" size="md">
                    <InputField
                      placeholder="Въведете вашата парола"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      returnKeyType={isLogin ? "done" : "next"}
                      onSubmitEditing={
                        isLogin ? () => handleSubmit(onSubmit)() : undefined
                      }
                    />
                    <Pressable
                      onPress={() => setShowPassword(!showPassword)}
                      className="absolute right-3 p-1"
                    >
                      <Icon
                        as={showPassword ? EyeOffIcon : EyeIcon}
                        size="sm"
                        className="text-typography-500"
                      />
                    </Pressable>
                  </Input>
                )}
              />
              <FormControlError>
                <FormControlErrorText>
                  {getFieldError("password")}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>

            {/* Confirm Password Field (only for signup) */}
            {!isLogin && (
              <FormControl isInvalid={!!getFieldError("confirmPassword")}>
                <FormControlLabel>
                  <FormControlLabelText>Потвърди парола</FormControlLabelText>
                </FormControlLabel>
                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input variant="outline" size="md">
                      <InputField
                        placeholder="Потвърдете вашата парола"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        secureTextEntry={!showConfirmPassword}
                        autoCapitalize="none"
                        returnKeyType="done"
                        onSubmitEditing={() => handleSubmit(onSubmit)()}
                      />
                      <Pressable
                        onPress={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 p-1"
                      >
                        <Icon
                          as={showConfirmPassword ? EyeOffIcon : EyeIcon}
                          size="sm"
                          className="text-typography-500"
                        />
                      </Pressable>
                    </Input>
                  )}
                />
                <FormControlError>
                  <FormControlErrorText>
                    {getFieldError("confirmPassword")}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
            )}

            <Button
              onPress={handleSubmit(onSubmit)}
              action="primary"
              variant="solid"
              size="md"
              className="mt-4"
              disabled={!isValid || isSubmitting}
            >
              <ButtonText>
                {isSubmitting
                  ? isLogin
                    ? "Влизане..."
                    : "Регистрация..."
                  : isLogin
                  ? "Влизане"
                  : "Регистрация"}
              </ButtonText>
            </Button>
          </VStack>

          <Divider className="my-4" />

          <Center>
            <HStack space="sm" className="items-center">
              <Text className="text-typography-600">
                {isLogin ? "Нямате акаунт?" : "Вече имате акаунт?"}
              </Text>
              <Pressable onPress={toggleMode}>
                <Text className="font-semibold text-primary-600">
                  {isLogin ? "Регистрация" : "Влизане"}
                </Text>
              </Pressable>
            </HStack>
          </Center>
        </VStack>
      </Box>
    </Center>
  );
};
