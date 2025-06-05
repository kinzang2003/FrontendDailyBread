import { AlertCircle } from "lucide-react";

export default function List({ items, editProduct, inventory, setInventory }) {
  return (
    <div className="mt-4 grid grid-cols-1 gap-4">
      {items.map((item) => {
        const isLowStock = item.stock < 10;
        return (
          <div
            key={item.id}
            className={`flex border p-4 rounded-lg shadow-md max-w-[412px] relative ${
              isLowStock ? "border-red-500 bg-red-50" : ""
            }`}
          >
            {isLowStock && (
              <div className="absolute top-2 right-2 animate-pulse text-red-500">
                <AlertCircle className="w-5 h-5" />
              </div>
            )}
            <div>
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover"
              />
              <span className="text-sm">Stock: {item.stock}</span>
            </div>
            <span className="text-center">
              {item.name}
              {item.description ? ` (${item.description})` : ""}
            </span>
            <div className="flex flex-col w-full mt-2 items-end">
              <span className="flex-1">{item.price} Nu.</span>
              <div className="flex gap-2 text-sm">
                <button
                  onClick={() => editProduct(item.id)}
                  className="bg-black text-white px-3 py-1 rounded h-[38px] w-20"
                >
                  Edit
                </button>
                <button
                  onClick={() =>
                    setInventory(
                      inventory.map((invItem) =>
                        invItem.id === item.id
                          ? { ...invItem, disabled: !invItem.disabled }
                          : invItem
                      )
                    )
                  }
                  className="border px-3 py-1 rounded"
                >
                  {item.disabled ? "Enable" : "Disable"}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
