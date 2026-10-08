import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TeachingPlanScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.eyebrow}>TEACHING</Text>
        <Text style={styles.title}>Teaching Plan</Text>
        <Text style={styles.subtitle}>
          Your AI-generated teaching plans will appear here.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:{flex:1,backgroundColor:"#040A14"},
  container:{flex:1,padding:24,justifyContent:"center"},
  eyebrow:{color:"#43BFFF",fontSize:11,fontWeight:"900",letterSpacing:2},
  title:{color:"#FFF",fontSize:30,fontWeight:"800",marginTop:8},
  subtitle:{color:"#7188A2",fontSize:14,marginTop:8}
});

