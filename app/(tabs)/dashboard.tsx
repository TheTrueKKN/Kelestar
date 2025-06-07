import React, { useCallback, useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  useWindowDimensions,
  TouchableOpacity,
  Modal,
} from "react-native";
import { PieChart, BarChart } from "react-native-chart-kit";
import { Link, useFocusEffect } from "expo-router";
import {
  getVendorByUser,
  getVendorRank,
} from "../../controllers/vendorController";
import { joinVendorDishIng } from "../../controllers/vendorDishIngJoinController";
import { Dish } from "../../interfaces/dish";
import { PieData } from "../../interfaces/pieData";
import { BarData } from "../../interfaces/barData";

const chartColors = [
  "#3B82F6", // blue
  "#22C55E", // green
  "#FACC15", // yellow
  "#38BDF8", // light blue
  "#0EA5E9", // sky blue
];

const Dashboard = () => {
  const { width } = useWindowDimensions();
  const [vendorId, setVendorId] = useState("");
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [totalCarbon, setTotalCarbon] = useState(0);
  const [totalDishes, setTotalDishes] = useState(0);
  const [carbonScore, setCarbonScore] = useState(0);
  const [vendorRank, setVendorRank] = useState(0);
  const [loading, setLoading] = useState(false);

  const best_case_footprint = 0.5;
  const worst_case_footprint = 10;
  // Chart related
  const [pieData, setPieData] = useState<PieData[]>([]);
  const [otherIngredients, setOtherIngredients] = useState<
    { name: string; population: number }[]
  >([]);
  const [showOthersModal, setShowOthersModal] = useState(false);
  const [barData, setBarData] = useState<BarData>({
    labels: [],
    datasets: [{ data: [] }],
  });
  // Persistent color maps for ingredients and dishes
  const assignedColorsRef = useRef<Record<string, string>>({});
  const barColorsRef = useRef<Record<string, string>>({});

  const barWidth = 60;
  const chartWidth = Math.max(barData.labels.length * barWidth, width);

  useEffect(() => {
    setLoading(true);
    const getVendorValues = async () => {
      const result = await getVendorByUser();

      if (result) {
        setVendorId(result.id!);
      }
    };
    getVendorValues();
  }, []);

  useEffect(() => {
    const vendorDishIngredient = async () => {
      if (!vendorId) return;
      //console.log(`Current vendor id: ${vendorId}`)
      const ranking = await getVendorRank(vendorId);
      const result = await joinVendorDishIng(vendorId);

      //console.log(`Testing vendor dish and ingredientr: ${JSON.stringify(result)}`)
      if (Array.isArray(result) && ranking) {
        setDishes(result);
        setVendorRank(ranking);
      } else {
        setDishes([]);
      }
    };

    vendorDishIngredient();
  }, [vendorId]);

  // Changes when dishes data updated
  useEffect(() => {
    setLoading(true);
    const totalCarbon = dishes.reduce(
      (sum, dish) =>
        sum +
        (typeof dish.dish_total_carbon === "number"
          ? dish.dish_total_carbon
          : 0),
      0
    );
    const totalDishes = dishes.length;
    const avgFootprint = totalDishes > 0 ? totalCarbon / totalDishes : 0;

    console.log(`Carbon total value: ${totalCarbon}, avg footprint:${avgFootprint}`)
    setTotalCarbon(isNaN(totalCarbon) ? 0 : Number(totalCarbon.toFixed(2)));
    setTotalDishes(totalDishes);

    // Normalize the score
    let normalizedScore = 0;
    if (totalDishes > 0) {
      normalizedScore =
        ((worst_case_footprint - avgFootprint) /
          (worst_case_footprint - best_case_footprint)) *
        100;
      normalizedScore = Math.max(0, Math.min(100, normalizedScore));
    }

    setCarbonScore(Number(normalizedScore.toFixed(2)));

    // Compute top 4 and others
    const { topPieData, otherList } = (() => {
      const totals: Record<string, number> = {};
      dishes.forEach((dish) => {
        dish.dish_ingredient?.forEach((ing) => {
          const name = ing.ingredient.ingredient_name;
          totals[name] = (totals[name] || 0) + ing.ingredient_amount;
        });
      });
      const entries = Object.entries(totals).sort((a, b) => b[1] - a[1]);
      const topEntries = entries.slice(0, 4);
      const otherEntries = entries.slice(4);
      const topPie: PieData[] = topEntries.map(([name, total], idx) => ({
        name,
        population: total,
        // use deterministic chartColors for consistency
        color: chartColors[idx % chartColors.length],
        legendFontColor: "#54595E",
        legendFontSize: 15,
      }));
      const otherListData = otherEntries.map(([name, total]) => ({
        name,
        population: total,
      }));
      if (otherEntries.length > 0) {
        const othersTotal = otherEntries.reduce((sum, [, v]) => sum + v, 0);
        topPie.push({
          name: "Others",
          population: othersTotal,
          color: "#A9A9A9",
          legendFontColor: "#54595E",
          legendFontSize: 15,
        });
      }
      return { topPieData: topPie, otherList: otherListData };
    })();
    setPieData(topPieData);
    setOtherIngredients(otherList);
    setBarData(getBarChartData(dishes));
    setLoading(false);
  }, [dishes]);

  useFocusEffect(
    useCallback(() => {
      if (vendorId) {
        setDishMenu();
        console.log(`Current vendor: ${vendorId}`);
      }
    }, [vendorId])
  );

  const setDishMenu = async () => {
    const menu_result = await joinVendorDishIng(vendorId);
    const ranking = await getVendorRank(vendorId);
    console.log(`Current ranking: ${ranking}`)
    if (Array.isArray(menu_result) && ranking) {
      setDishes(menu_result);
      setVendorRank(ranking);
    } else {
      setDishes([]);
    }
  };

  const getRandomColor = (): string => {
    const letters = "0123456789ABCDEF";
    return (
      "#" +
      Array.from(
        { length: 6 },
        () => letters[Math.floor(Math.random() * 16)]
      ).join("")
    );
  };

  const getColorForIngredient = (ingredientName: string): string => {
    const map = assignedColorsRef.current;
    if (!map[ingredientName]) {
      map[ingredientName] = getRandomColor();
    }
    return map[ingredientName];
  };

  const getColorForDish = (dishName: string): string => {
    const map = barColorsRef.current;
    if (!map[dishName]) {
      map[dishName] = getRandomColor();
    }
    return map[dishName];
  };

  const getPieChartData = (dishes: Dish[]): PieData[] => {
    // Aggregate ingredient amounts
    const totals: Record<string, number> = {};
    dishes.forEach((dish) => {
      dish.dish_ingredient?.forEach((ing) => {
        const name = ing.ingredient.ingredient_name;
        totals[name] = (totals[name] || 0) + ing.ingredient_amount;
      });
    });
    // Sort by descending totals
    const entries = Object.entries(totals).sort((a, b) => b[1] - a[1]);
    // Top 4 ingredients
    const topEntries = entries.slice(0, 4);
    const otherEntries = entries.slice(4);
    const pie: PieData[] = topEntries.map(([name, total], idx) => ({
      name,
      population: total,
      color: chartColors[idx % chartColors.length],
      legendFontColor: "#54595E",
      legendFontSize: 15,
    }));
    // Aggregate others
    if (otherEntries.length > 0) {
      const othersTotal = otherEntries.reduce((sum, [, v]) => sum + v, 0);
      pie.push({
        name: "Others",
        population: othersTotal,
        color: "#A9A9A9",
        legendFontColor: "#54595E",
        legendFontSize: 15,
      });
    }
    return pie;
  };

  const getBarChartData = (dishes: Dish[]): BarData => {
    const labels = dishes.map((dish) => dish.dish_name!);
    const data = dishes.map((dish) => Number(dish.dish_total_carbon?.toFixed(2)));
    // Use deterministic chartColors for consistent bar colors
    const colors = dishes.map(
      (_, idx) => () => chartColors[idx % chartColors.length]
    );

    return {
      labels,
      datasets: [
        {
          data,
          colors,
        },
      ],
    };
  };

  if (loading) {
    return (
      <Text style={{ textAlign: "center", marginTop: 32 }}>
        Loading Dashboard...
      </Text>
    );
  }

  //console.log(`Content in dishs: ${JSON.stringify(dishes)}`)
  //console.log(`WTF inside of pie data: ${JSON.stringify(pieData)}`)

  return (
    <ScrollView className="bg-white h-full">
      <View className="px-5 pt-6 pb-8">
        <Text className="text-3xl font-pbold text-primary mb-2">
          Carbon Dashboard
        </Text>
        <View className="flex-row justify-between mt-4">
          <View
            className="bg-[#F8F9FA] p-4 rounded-2xl flex-1 mr-1 border border-gray-100"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.18,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <Text className="text-xs text-secondary font-psemibold mb-1">
              Green Score
            </Text>
            <Text className="text-xl font-bold text-primary">
              {carbonScore}%
            </Text>
          </View>
          <View
            className="bg-[#F8F9FA] p-4 rounded-2xl flex-1 ml-1 border border-gray-100"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.18,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <Text className="text-xs text-green font-psemibold mb-1">
              Total Footprint
            </Text>
            <Text className="text-xl font-bold text-primary">
              {totalCarbon} kg CO₂e
            </Text>
          </View>
        </View>

        <View className="flex-row justify-between mt-4">
          <View
            className="bg-[#F8F9FA] p-4 rounded-2xl flex-1 mr-1 border border-gray-100"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.18,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <Text className="text-xs text-yellow-500 font-psemibold mb-1">
              Ranking
            </Text>
            <Text className="text-xl font-bold text-primary">
              #{vendorRank}
            </Text>
          </View>
          <View
            className="bg-[#F8F9FA] p-4 rounded-2xl flex-1 ml-1 border border-gray-100"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.18,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <Text className="text-xs text-green font-psemibold mb-1">
              Green Meals
            </Text>
            <Text className="text-xl font-bold text-primary">
              {totalDishes}
            </Text>
          </View>
        </View>

        {/* Pie Chart */}
        <Text className="mt-7 text-lg font-semibold text-primary mb-2 text-left">
          Footprint Composition by Ingredients
        </Text>
        {/* PieChart container */}
        <View className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 mb-2 w-full">
          <View className="w-full flex-row justify-center">
            <PieChart
              data={pieData}
              width={width - 60}
              height={200}
              hasLegend={false}
              chartConfig={{
                color: (opacity = 1) => `#54595E`,
                labelColor: (opacity = 1) => `#54595E`,
                backgroundColor: "#fff",
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                decimalPlaces: 0,
                style: { borderRadius: 18 },
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="75"
              absolute
            />
          </View>
        </View>
        {/* Custom Pie Chart Legend below chart */}
        <View className="flex-row flex-wrap justify-center mb-4">
          {pieData.map((slice) => (
            <TouchableOpacity
              key={slice.name}
              onPress={() =>
                slice.name === "Others" && setShowOthersModal(true)
              }
              className="flex-row items-center mx-3 mb-2"
            >
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: slice.color,
                  marginRight: 6,
                }}
              />
              <Text
                className={`text-xs text-gray-600 ${
                  slice.name === "Others" ? "underline" : ""
                }`}
              >
                {slice.name}
                {slice.name === "Others" ? "" : ` (${slice.population})`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text className="text-lg font-semibold text-primary mb-2 text-left">
          Dish Footprint
        </Text>
        <View className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <BarChart
              data={barData}
              width={chartWidth}
              height={220}
              yAxisLabel=""
              yAxisSuffix=""
              fromZero
              showValuesOnTopOfBars
              withCustomBarColorFromData={true}
              flatColor={true}
              chartConfig={{
                backgroundColor: "#fff",
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                decimalPlaces: 0,
                color: (_index, opacity = 1) => {
                  const index = typeof _index === "number" ? _index : 0;
                  return chartColors[index % chartColors.length];
                },
                labelColor: () => `#54595E`,
                propsForLabels: { fontSize: 13, fontWeight: "bold", dy: 8 },
                propsForBackgroundLines: {
                  stroke: "#E5E7EB",
                  strokeDasharray: "4",
                },
                style: { borderRadius: 18 },
              }}
              style={{
                marginVertical: 8,
                borderRadius: 18,
                paddingRight: 10,
              }}
            />
          </ScrollView>
        </View>
        {/* Chart legend for bars */}
        <View className="flex-row flex-wrap justify-center mt-3">
          {barData.labels.map((label, idx) => (
            // Use unique key instead of index
            <View
              key={`${label}-${idx}`}
              className="flex-row items-center mx-2 mb-2"
            >
              <View
                className="w-3 h-3 rounded-sm"
                style={{
                  backgroundColor: chartColors[idx % chartColors.length],
                }}
              />
              <Text className="text-xs text-gray-500 ml-1">{label}</Text>
            </View>
          ))}
        </View>
      </View>
      {/* Modal showing other ingredients */}
      <Modal
        transparent
        visible={showOthersModal}
        animationType="slide"
        onRequestClose={() => setShowOthersModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.3)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View className="bg-white w-80 p-6 rounded-lg">
            <Text className="text-lg font-semibold mb-4">
              Other Ingredients
            </Text>
            <ScrollView style={{ maxHeight: 200 }} showsVerticalScrollIndicator>
              {otherIngredients.map(({ name, population }) => (
                <View key={name} className="flex-row items-center mb-2">
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: "#A9A9A9",
                      marginRight: 8,
                    }}
                  />
                  <Text>
                    {name}: {population}g
                  </Text>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity
              onPress={() => setShowOthersModal(false)}
              className="mt-4 self-end"
            >
              <Text className="text-blue-500">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default Dashboard;
