import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Brain,
  Target,
  Clock3,
  ChevronRight,
  Sparkles,
  BookOpen,
} from "lucide-react-native";
import BottomNav from "../components/BottomNav";

export default function AnalyticsScreen() {
  return (
    <SafeAreaView
      edges={["top", "left", "right", "bottom"]}
      style={styles.safe}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>CLASS PILOT</Text>
            <Text style={styles.title}>Analytics</Text>
            <Text style={styles.subtitle}>
              Understand teaching progress and student performance.
            </Text>
          </View>

          <View style={styles.headerIcon}>
            <TrendingUp size={21} color="#43BFFF" />
          </View>
        </View>

        {/* OVERVIEW */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <Text style={styles.period}>This month</Text>
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            icon={<Target size={19} color="#43BFFF" />}
            label="Understanding"
            value="84%"
            change="+8.4%"
            positive
          />

          <StatCard
            icon={<Brain size={19} color="#43BFFF" />}
            label="Retention"
            value="76%"
            change="+5.2%"
            positive
          />

          <StatCard
            icon={<Users size={19} color="#43BFFF" />}
            label="Students"
            value="128"
            change="+12"
            positive
          />

          <StatCard
            icon={<Clock3 size={19} color="#43BFFF" />}
            label="Teaching Time"
            value="42h"
            change="+6h"
            positive
          />
        </View>

        {/* PERFORMANCE */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Class Performance</Text>
          <Text style={styles.smallLabel}>AVG. SCORE</Text>
        </View>

        <View style={styles.performanceCard}>
          <View style={styles.performanceTop}>
            <View>
              <Text style={styles.performanceValue}>82%</Text>
              <View style={styles.performanceChange}>
                <TrendingUp size={13} color="#50E3A4" />
                <Text style={styles.greenText}>7.8% from last month</Text>
              </View>
            </View>

            <View style={styles.performanceBadge}>
              <Text style={styles.performanceBadgeText}>GOOD</Text>
            </View>
          </View>

          <View style={styles.chart}>
            <Bar height={42} label="M" />
            <Bar height={58} label="T" />
            <Bar height={48} label="W" />
            <Bar height={72} label="T" />
            <Bar height={64} label="F" />
            <Bar height={82} label="S" active />
            <Bar height={76} label="S" />
          </View>
        </View>

        {/* CONCEPT INSIGHTS */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Concept Insights</Text>
          <Pressable>
            <Text style={styles.viewAll}>View all</Text>
          </Pressable>
        </View>

        <InsightRow
          title="Data Structures"
          subtitle="Strong understanding"
          percentage="91%"
          positive
        />

        <InsightRow
          title="Database Management"
          subtitle="Needs reinforcement"
          percentage="68%"
        />

        <InsightRow
          title="Operating Systems"
          subtitle="Good understanding"
          percentage="84%"
          positive
        />

        {/* RETENTION */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Retention</Text>
          <Text style={styles.smallLabel}>LAST 7 DAYS</Text>
        </View>

        <View style={styles.retentionCard}>
          <View style={styles.retentionMain}>
            <View style={styles.retentionRing}>
              <Text style={styles.retentionValue}>76%</Text>
              <Text style={styles.retentionLabel}>Retained</Text>
            </View>

            <View style={styles.retentionInfo}>
              <RetentionItem
                label="Retained"
                value="97 students"
                percentage="76%"
              />
              <RetentionItem
                label="Needs review"
                value="31 students"
                percentage="24%"
              />
            </View>
          </View>
        </View>

        {/* AI INSIGHT */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>ClassPilot AI</Text>
        </View>

        <View style={styles.aiCard}>
          <View style={styles.aiIcon}>
            <Sparkles size={20} color="#43BFFF" />
          </View>

          <View style={styles.aiContent}>
            <Text style={styles.aiTitle}>Teaching Insight</Text>
            <Text style={styles.aiText}>
              Database Management is currently your weakest concept area.
              Consider a short concept refresh before the next assessment.
            </Text>

            <Pressable style={styles.aiAction}>
              <Text style={styles.aiActionText}>View recommendation</Text>
              <ChevronRight size={16} color="#43BFFF" />
            </Pressable>
          </View>
        </View>

        {/* RECENT ACTIVITY */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
        </View>

        <ActivityRow
          icon={<BookOpen size={17} color="#43BFFF" />}
          title="Operating Systems assessment"
          subtitle="32 students completed"
          score="86%"
        />

        <ActivityRow
          icon={<Brain size={17} color="#43BFFF" />}
          title="Database retention check"
          subtitle="28 students completed"
          score="74%"
        />

        <ActivityRow
          icon={<Target size={17} color="#43BFFF" />}
          title="Data Structures understanding check"
          subtitle="35 students completed"
          score="91%"
        />

        <View style={{ height: 18 }} />
      </ScrollView>

      <BottomNav />
    </SafeAreaView>
  );
}

/* ---------- COMPONENTS ---------- */

function StatCard({
  icon,
  label,
  value,
  change,
  positive,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  change: string;
  positive?: boolean;
}) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statIcon}>{icon}</View>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>

      <View style={styles.changeRow}>
        {positive ? (
          <TrendingUp size={12} color="#50E3A4" />
        ) : (
          <TrendingDown size={12} color="#FF7188" />
        )}
        <Text
          style={[
            styles.changeText,
            { color: positive ? "#50E3A4" : "#FF7188" },
          ]}
        >
          {change}
        </Text>
      </View>
    </View>
  );
}

function Bar({
  height,
  label,
  active,
}: {
  height: number;
  label: string;
  active?: boolean;
}) {
  return (
    <View style={styles.barItem}>
      <View
        style={[
          styles.bar,
          { height },
          active && styles.activeBar,
        ]}
      />
      <Text style={styles.barLabel}>{label}</Text>
    </View>
  );
}

function InsightRow({
  title,
  subtitle,
  percentage,
  positive,
}: {
  title: string;
  subtitle: string;
  percentage: string;
  positive?: boolean;
}) {
  return (
    <View style={styles.insightCard}>
      <View style={styles.insightIcon}>
        <Brain size={17} color="#43BFFF" />
      </View>

      <View style={styles.insightText}>
        <Text style={styles.insightTitle}>{title}</Text>
        <Text style={styles.insightSubtitle}>{subtitle}</Text>
      </View>

      <View style={styles.insightScore}>
        <Text style={styles.insightPercentage}>{percentage}</Text>
        <View
          style={[
            styles.progressTrack,
            { width: 58 },
          ]}
        >
          <View
            style={[
              styles.progressFill,
              {
                width:
                  percentage === "91%"
                    ? 53
                    : percentage === "84%"
                    ? 49
                    : 39,
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

function RetentionItem({
  label,
  value,
  percentage,
}: {
  label: string;
  value: string;
  percentage: string;
}) {
  return (
    <View style={styles.retentionItem}>
      <View>
        <Text style={styles.retentionItemLabel}>{label}</Text>
        <Text style={styles.retentionItemValue}>{value}</Text>
      </View>

      <Text style={styles.retentionItemPercentage}>{percentage}</Text>
    </View>
  );
}

function ActivityRow({
  icon,
  title,
  subtitle,
  score,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  score: string;
}) {
  return (
    <View style={styles.activityCard}>
      <View style={styles.activityIcon}>{icon}</View>

      <View style={styles.activityText}>
        <Text style={styles.activityTitle}>{title}</Text>
        <Text style={styles.activitySubtitle}>{subtitle}</Text>
      </View>

      <Text style={styles.activityScore}>{score}</Text>
    </View>
  );
}

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#040A14",
  },

  content: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 25,
  },

  eyebrow: {
    color: "#43BFFF",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 2,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "800",
    marginTop: 5,
  },

  subtitle: {
    color: "#7188A2",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 5,
    maxWidth: 290,
  },

  headerIcon: {
    width: 43,
    height: 43,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#071827",
    borderWidth: 1,
    borderColor: "#123652",
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 11,
    marginTop: 4,
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
  },

  period: {
    color: "#5E7690",
    fontSize: 11,
    fontWeight: "700",
  },

  smallLabel: {
    color: "#5E7690",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
  },

  viewAll: {
    color: "#43BFFF",
    fontSize: 12,
    fontWeight: "700",
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 22,
  },

  statCard: {
    width: "48.2%",
    backgroundColor: "#07121F",
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#102B41",
    padding: 14,
    marginBottom: 10,
  },

  statIcon: {
    width: 35,
    height: 35,
    borderRadius: 11,
    backgroundColor: "#082033",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 11,
  },

  statLabel: {
    color: "#6F879F",
    fontSize: 11,
    fontWeight: "600",
  },

  statValue: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "800",
    marginTop: 3,
  },

  changeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },

  changeText: {
    fontSize: 10,
    fontWeight: "700",
  },

  performanceCard: {
    backgroundColor: "#07121F",
    borderRadius: 19,
    borderWidth: 1,
    borderColor: "#102B41",
    padding: 17,
    marginBottom: 22,
  },

  performanceTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  performanceValue: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "900",
  },

  performanceChange: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },

  greenText: {
    color: "#50E3A4",
    fontSize: 10,
    fontWeight: "700",
  },

  performanceBadge: {
    backgroundColor: "#0A2A25",
    borderWidth: 1,
    borderColor: "#174C43",
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },

  performanceBadgeText: {
    color: "#50E3A4",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1,
  },

  chart: {
    height: 115,
    marginTop: 19,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderBottomColor: "#173047",
  },

  barItem: {
    height: 110,
    alignItems: "center",
    justifyContent: "flex-end",
    width: 30,
  },

  bar: {
    width: 17,
    borderRadius: 7,
    backgroundColor: "#174261",
  },

  activeBar: {
    backgroundColor: "#43BFFF",
  },

  barLabel: {
    color: "#5E7690",
    fontSize: 9,
    marginTop: 7,
    marginBottom: 5,
  },

  insightCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#07121F",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#102B41",
    padding: 12,
    marginBottom: 8,
  },

  insightIcon: {
    width: 37,
    height: 37,
    borderRadius: 11,
    backgroundColor: "#082033",
    alignItems: "center",
    justifyContent: "center",
  },

  insightText: {
    flex: 1,
    marginLeft: 11,
  },

  insightTitle: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "750",
  },

  insightSubtitle: {
    color: "#687F98",
    fontSize: 10,
    marginTop: 3,
  },

  insightScore: {
    alignItems: "flex-end",
  },

  insightPercentage: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 5,
  },

  progressTrack: {
    height: 4,
    borderRadius: 5,
    backgroundColor: "#13283B",
    overflow: "hidden",
  },

  progressFill: {
    height: 4,
    borderRadius: 5,
    backgroundColor: "#43BFFF",
  },

  retentionCard: {
    backgroundColor: "#07121F",
    borderRadius: 19,
    borderWidth: 1,
    borderColor: "#102B41",
    padding: 17,
    marginBottom: 22,
  },

  retentionMain: {
    flexDirection: "row",
    alignItems: "center",
  },

  retentionRing: {
    width: 105,
    height: 105,
    borderRadius: 53,
    borderWidth: 9,
    borderColor: "#43BFFF",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#06111D",
  },

  retentionValue: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
  },

  retentionLabel: {
    color: "#668098",
    fontSize: 9,
    marginTop: 1,
  },

  retentionInfo: {
    flex: 1,
    marginLeft: 20,
    gap: 13,
  },

  retentionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  retentionItemLabel: {
    color: "#7188A2",
    fontSize: 10,
  },

  retentionItemValue: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 2,
  },

  retentionItemPercentage: {
    color: "#43BFFF",
    fontSize: 12,
    fontWeight: "800",
  },

  aiCard: {
    flexDirection: "row",
    backgroundColor: "#071522",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#15405B",
    padding: 15,
    marginBottom: 22,
  },

  aiIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: "#08263A",
    alignItems: "center",
    justifyContent: "center",
  },

  aiContent: {
    flex: 1,
    marginLeft: 12,
  },

  aiTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },

  aiText: {
    color: "#8398AD",
    fontSize: 11,
    lineHeight: 17,
    marginTop: 5,
  },

  aiAction: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  aiActionText: {
    color: "#43BFFF",
    fontSize: 11,
    fontWeight: "800",
  },

  activityCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#07121F",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#102B41",
    padding: 12,
    marginBottom: 8,
  },

  activityIcon: {
    width: 37,
    height: 37,
    borderRadius: 11,
    backgroundColor: "#082033",
    alignItems: "center",
    justifyContent: "center",
  },

  activityText: {
    flex: 1,
    marginLeft: 11,
  },

  activityTitle: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },

  activitySubtitle: {
    color: "#657C94",
    fontSize: 10,
    marginTop: 3,
  },

  activityScore: {
    color: "#43BFFF",
    fontSize: 14,
    fontWeight: "900",
  },
});
