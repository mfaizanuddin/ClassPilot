import React, { useEffect } from "react";
import { BackHandler } from "react-native";
import { Stack, usePathname, useRouter } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleBack = () => {
      // Dashboard = Home.
      // Android Back does NOTHING here.
      if (pathname === "/teacher-dashboard") {
        return true;
      }

      // Never let Android Back log the teacher out.
      // From every app screen, go back to Dashboard.
      if (
        pathname === "/syllabi" ||
        pathname === "/classes" ||
        pathname === "/analytics" ||
        pathname === "/copilot" ||
        pathname === "/assessment" ||
        pathname === "/teaching-plan" ||
        pathname === "/upload-syllabus"
      ) {
        router.replace("/teacher-dashboard");
        return true;
      }

      // Auth screens keep their normal navigation behavior.
      return false;
    };

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBack
    );

    return () => subscription.remove();
  }, [pathname, router]);

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade",
          contentStyle: {
            backgroundColor: "#050B14",
          },
        }}
      />
    </SafeAreaProvider>
  );
}
