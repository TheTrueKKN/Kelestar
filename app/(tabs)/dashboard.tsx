import React, { useCallback, useEffect, useState } from "react";
import { View, Text, ScrollView, useWindowDimensions } from "react-native";
import { PieChart, BarChart } from "react-native-chart-kit";
import { Link, useFocusEffect } from "expo-router";
import { getVendorByUser, getVendorRank } from "../../controllers/vendorController";
import { joinVendorDishIng } from "../../controllers/vendorDishIngJoinController";
import { Dish } from "../../interfaces/dish";
import { PieData } from "../../interfaces/pieData";
import { BarData } from "../../interfaces/barData";

// const pieData = [
//   {
//     name: "Beef",
//     population: 30,
//     color: "#3B82F6", // blue
//     legendFontColor: "#54595E",
//     legendFontSize: 15,
//   },
//   {
//     name: "Poultry",
//     population: 20,
//     color: "#22C55E", // green
//     legendFontColor: "#54595E",
//     legendFontSize: 15,
//   },
//   {
//     name: "Mutton",
//     population: 35,
//     color: "#FACC15", // yellow
//     legendFontColor: "#54595E",
//     legendFontSize: 15,
//   },
//   {
//     name: "Others",
//     population: 15,
//     color: "#38BDF8", // light blue
//     legendFontColor: "#54595E",
//     legendFontSize: 15,
//   },
// ];

const chartColors = [
  "#3B82F6", // blue
  "#22C55E", // green
  "#FACC15", // yellow
  "#38BDF8", // light blue
  "#0EA5E9", // sky blue
];

const barData = {
  labels: [
    "Chicken Rice",
    "Mutton Curry",
    "Tofu Bowl",
    "Beef Salad",
    "Fried Shrimp",
  ],
  datasets: [
    {
      data: [80, 110, 50, 123, 85],
    },
  ],
};



const Dashboard = () => {
  const { width } = useWindowDimensions();
  const [vendorId, setVendorId] = useState("");
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [totalCarbon, setTotalCarbon] = useState(0);
  const [totalDishes, setTotalDishes] = useState(0);
  const [carbonScore, setCarbonScore] = useState(0);
  const [vendorRank, setVendorRank] = useState(0);
  const best_case_footprint = 0.5
  const worst_case_footprint = 10
  // Chart related
  const [pieData, setPieData] = useState<PieData[]>([]);
  const [barData, setBarData] = useState<BarData>({
    labels: [],
    datasets: [{ data: [] }],
  });
  const assignedColors: Record<string, string> = {};
  const barColors: Record<string, string> = {};
  

  useEffect(() => {
        const getVendorValues = async () => {
          const result = await getVendorByUser();

          if(result){
            setVendorId(result.id!)
          }
        };
        getVendorValues()
      }, []);

    useEffect(()=> {
        const vendorDishIngredient = async () => {
          if (!vendorId) return;
          //console.log(`Current vendor id: ${vendorId}`)
          const ranking = await getVendorRank(vendorId)
          const result = await joinVendorDishIng(vendorId)
          
          //console.log(`Testing vendor dish and ingredientr: ${JSON.stringify(result)}`)
          if(Array.isArray(result) && ranking){
            setDishes(result)
            setVendorRank(ranking)
          } 
          else{
            setDishes([])
          }
        }

        vendorDishIngredient()
      }, [vendorId]);

    // Changes when dishes data updated
    useEffect(() => {
      
      const totalCarbon = dishes.reduce(
        (sum, dish) => sum + (typeof dish.dish_total_carbon === "number" ? dish.dish_total_carbon : 0),
        0
      );
      const totalDishes = dishes.length;
      const avgFootprint = totalDishes > 0 ? totalCarbon / totalDishes : 0;
      
      //console.log(`Carbon total value: ${totalCarbon}`)
      setTotalCarbon(isNaN(totalCarbon) ? 0 : Number(totalCarbon.toFixed(2)));
      setTotalDishes(totalDishes);
      

      // Normalize the score
      let normalizedScore = 0;
      if (totalDishes > 0) {
        normalizedScore =
        ((worst_case_footprint - avgFootprint) / (worst_case_footprint - best_case_footprint)) * 100;
        normalizedScore = Math.max(0, Math.min(100, normalizedScore));
      }

      setCarbonScore(Number(normalizedScore.toFixed(2)));

      setPieData(getPieChartData(dishes));
      setBarData(getBarChartData(dishes));
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
          const menu_result = await joinVendorDishIng(vendorId)
          const ranking = await getVendorRank(vendorId)
          if(Array.isArray(menu_result) && ranking){
            setDishes(menu_result)
            setVendorRank(ranking)
          } 
          else{
            setDishes([])
          }
      }
      
      const getRandomColor = (): string => {
        const letters = "0123456789ABCDEF";
        return "#" + Array.from({ length: 6 }, () =>
          letters[Math.floor(Math.random() * 16)]
      ).join("");
    };
    
    const getColorForIngredient = (ingredientName: string): string => {
      if (!assignedColors[ingredientName]) {
        assignedColors[ingredientName] = getRandomColor();
      }
      return assignedColors[ingredientName];
    };

    const getColorForDish = (dishName: string): string => {
      if (!barColors[dishName]) {
        barColors[dishName] = getRandomColor();;
      }
      return barColors[dishName];
    };

    const getPieChartData = (dishes: Dish[]): PieData[] => {
      const ingredientTotals: Record<string, number> = {};
      
      dishes.forEach(dish => {
        dish.dish_ingredient?.forEach(ing => {
          const name = ing.ingredient.ingredient_name;
          const amount = ing.ingredient_amount;
          ingredientTotals[name] = (ingredientTotals[name] || 0) + amount;
        });
      });
      
      return Object.entries(ingredientTotals).map(([name, total]) => ({
        name,
        population: total,
        color: getColorForIngredient(name),
        legendFontColor: "#54595E",
        legendFontSize: 15,
      }));
    };
    
    const getBarChartData = (dishes: Dish[]): BarData => {
  const labels = dishes.map((dish) => dish.dish_name!);
  const data = dishes.map((dish) => dish.dish_total_carbon!);
  const colors = dishes.map((dish) => () => getColorForDish(dish.dish_name!));

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


    
    //console.log(`Content in dishs: ${JSON.stringify(dishes)}`)
    //console.log(`WTF inside of pie data: ${JSON.stringify(pieData)}`)

  return (
    <ScrollView className="bg-white h-full">
      <View className="px-5 pt-6 pb-8">
        <Text className="text-3xl font-pbold text-primary mb-2">
          Carbon Dashboard
        </Text>
        <View className="flex-row justify-between mt-4">
          <View className="bg-[#F8F9FA] p-4 rounded-2xl flex-1 mr-1 border border-gray-100" style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.18,
            shadowRadius: 8,
            elevation: 8,
          }}>
            <Text className="text-xs text-secondary font-psemibold mb-1">
              Green Score
            </Text>
            <Text className="text-xl font-bold text-primary">{carbonScore}%</Text>
          </View>
          <View className="bg-[#F8F9FA] p-4 rounded-2xl flex-1 ml-1 border border-gray-100" style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.18,
            shadowRadius: 8,
            elevation: 8,
          }}>
            <Text className="text-xs text-green font-psemibold mb-1">
              Total Footprint
            </Text>
            <Text className="text-xl font-bold text-primary">{totalCarbon} Kg</Text>
          </View>
        </View>

        <View className="flex-row justify-between mt-4">
          <View className="bg-[#F8F9FA] p-4 rounded-2xl flex-1 mr-1 border border-gray-100" style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.18,
            shadowRadius: 8,
            elevation: 8,
          }}>
            <Text className="text-xs text-yellow-500 font-psemibold mb-1">
              Ranking
            </Text>
            <Text className="text-xl font-bold text-primary">#{vendorRank}</Text>
          </View>
          <View className="bg-[#F8F9FA] p-4 rounded-2xl flex-1 ml-1 border border-gray-100" style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.18,
            shadowRadius: 8,
            elevation: 8,
          }}>
            <Text className="text-xs text-green font-psemibold mb-1">
              Green Meals
            </Text>
            <Text className="text-xl font-bold text-primary">{totalDishes}</Text>
          </View>
        </View>

        {/* Pie Chart */}
        <Text className="mt-7 text-lg font-semibold text-primary mb-2 text-left">
          Footprint Composition by Ingredients
        </Text>
        <View className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 mb-4">
          <PieChart
            data={pieData}
            width={width - 60}
            height={200}
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
            paddingLeft="15"
            absolute
          />
        </View>

        <Text className="text-lg font-semibold text-primary mb-2 text-left">
          Dish Footprint
        </Text>
        <View className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2">
          <BarChart
            data={barData}
            width={width - 60}
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
              labelColor: (opacity = 1) => `#54595E`,
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
        </View>
        {/* Chart legend for bars */}
        <View className="flex-row flex-wrap justify-center mt-3">
          {barData.labels.map((label, idx) => (
            <View key={label} className="flex-row items-center mx-2 mb-2">
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
    </ScrollView>
  );
};

export default Dashboard;