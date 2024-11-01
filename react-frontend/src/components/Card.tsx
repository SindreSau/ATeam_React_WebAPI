import React from 'react'

type Props = {}

const Card = (props: Props) => {
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
    <div>
        <h1>Foodproducts</h1>
            <table className='table'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>description</th>
                        <th>Images</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map(item => (
                        <tr key={item.ItemId}>
                            <td>{item.ItemId}</td>
                            <td>{item.Name}</td>
                            <td>{item.Price}</td>
                            <td>{item.Description}</td>
                            <td><img src={item.ImageUrl} alt={item.Name} width={120} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
    </div>

    )
};

export default Card