export  interface JoinedDishIngredient  {
    ingredient_amount: number;
    ingredient: {
      id: string;
      ingredient_name: string;
      ingredient_footprint: number;
    };
  };