import React from 'react'

type Props = {}

const FoodProductList = (props: Props) => {
    const items = [
        {
          ItemId: 1,
          Name: "Fried Chicken Leg",
          Price: 20,
          Description: "Crispy and succulent chicken leg that is deep-fried to perfection, often served as a popular fast food item.",
          ImageUrl: "https://www.nasa.gov/wp-content/uploads/2023/03/pillars_of_creation.jpg"
        },
        {
          ItemId: 2,
          Name: "Fish and Chips",
          Price: 180,
          Description: "Classic British dish featuring battered and deep-fried fish served with thick-cut fried potatoes.",
          ImageUrl: "https://www.nasa.gov/wp-content/uploads/2023/03/pillars_of_creation.jpg"
        }
      ];
  return (
    <div>FoodProductList</div>
  )
}

export default FoodProductList